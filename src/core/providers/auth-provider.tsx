"use client"

import { createContext, type ReactNode, type FC, useCallback, useEffect, useMemo, useContext, useState } from "react";
import { httpClient } from "../lib/http-client";
import { tokenManager } from "../lib/token-manager/token-manager";
import { useUserStore } from "../stores";
import { useEnterpriseStore } from "../stores/enterpriseStore";
import { useLanguageStore } from "../stores/languageStore";
import { getProfile } from "../services/auth.service";
import type { Role } from "../config/enum";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  companyId?: string;
}

// API profile response may have firstName/lastName instead of name
interface ProfileApiResponse {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: Role;
  avatar?: string;
  phone?: string;
  companyId?: string;
  userEnterprise?: {
    id: string;
  };
}

// Map API response to User format
/** Returns true only if the profile has the minimum required string fields. */
function isValidProfile(profile: ProfileApiResponse): boolean {
  return (
    typeof profile.id === 'string' && profile.id.length > 0 &&
    typeof profile.email === 'string' && profile.email.length > 0 &&
    typeof profile.role === 'string' && profile.role.length > 0
  );
}

function mapProfileToUser(profile: ProfileApiResponse): User {
  // Ensure each field is a plain string — API may return objects or null in prod
  const rawName = typeof profile.name === 'string' ? profile.name : null;
  const rawFirst = typeof profile.firstName === 'string' ? profile.firstName : null;
  const rawLast = typeof profile.lastName === 'string' ? profile.lastName : null;
  const name = rawName || [rawFirst, rawLast].filter(Boolean).join(' ') || 'Utilisateur';

  if (!rawName && !rawFirst && !rawLast) {
    console.error('[AuthProvider] mapProfileToUser: name fields missing or not strings. profile.name:', typeof profile.name, '| firstName:', typeof profile.firstName, '| lastName:', typeof profile.lastName);
  }

  return {
    id: profile.id,
    email: profile.email,
    name,
    role: profile.role,
    avatar: typeof profile.avatar === 'string' ? profile.avatar : undefined,
    phone: typeof profile.phone === 'string' ? profile.phone : undefined,
    companyId: profile.companyId || profile.userEnterprise?.id,
  };
}

interface AuthContextType {
  user: User | null;
  isConnected: boolean;
  isLoadingProfile: boolean;
  isTokenHydrated: boolean;
  updateUser: (user: User | null) => void;
  clearUser: () => void;
  getRole: () => Role | null;
  getUserInfo: () => User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const { user, isAuthenticated, setUser, clearUser: clearUserStore, isHydrated, setTokenHydrated } = useUserStore();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const [isTokenHydrated, setIsTokenHydrated] = useState(false);

  // Hydrate both Zustand store (sessionStorage) and tokens (httpOnly cookies) after mount.
  // Both are done here in a single useEffect to avoid React Error #300:
  // Zustand v5 with synchronous storage fires onRehydrateStorage synchronously during the
  // first useUserStore() call (during render), which calls set() and notifies subscribers
  // while a component is rendering. By using skipHydration:true in the store and calling
  // rehydrate() here, we ensure all state updates happen safely after render.
  useEffect(() => {
    Promise.all([
      useUserStore.persist.rehydrate(),
      useEnterpriseStore.persist.rehydrate(),
      useLanguageStore.persist.rehydrate(),
      tokenManager.hydrateFromServer(),
    ]).then(() => {
      setIsTokenHydrated(true);
      setTokenHydrated(true);
    });
  }, [setTokenHydrated]);

  const clearUser = useCallback(() => {
    tokenManager.clearTokens();
    clearUserStore();
  }, [clearUserStore]);

  const updateUser = useCallback((newUser: User | null) => {
    if (newUser) {
      setUser(newUser);
    } else {
      clearUser();
    }
  }, [setUser, clearUser]);

  // Register interceptor for unauthorized responses
  useEffect(() => {
    const interceptorId = httpClient.catchUnauthorizedResponse(clearUser);

    return () => {
      if (interceptorId) {
        httpClient.rejectResponseInterceptor(interceptorId);
      }
    };
  }, [clearUser]);

  // Fetch profile if token exists but user is not in store
  useEffect(() => {
    // Wait for both store and token hydration before making decisions
    if (!isHydrated || !isTokenHydrated) {
      return;
    }

    const fetchUserProfile = async () => {
      const token = tokenManager.getToken();

      // Skip if we already have a user or already attempted fetch
      if (user || hasFetchedProfile) {
        return;
      }

      // No token = no fetch needed
      if (!token) {
        setHasFetchedProfile(true);
        return;
      }

      setIsLoadingProfile(true);
      try {
        const profileData = await getProfile() as ProfileApiResponse | null;
        if (profileData && isValidProfile(profileData)) {
          const mappedUser = mapProfileToUser(profileData);
          console.log('[AuthProvider] profile valid, user stored:', { id: mappedUser.id, email: mappedUser.email, role: mappedUser.role });
          setUser(mappedUser);
        } else {
          // Response present but fields corrupted (null/object) → don't store invalid user
          console.error('[AuthProvider] profile invalid or null - clearing user. profileData:', JSON.stringify(profileData));
          clearUser();
        }
      } catch (error: any) {
        // Only clear user on auth errors (401/403) - not on transient network issues
        const status = error?.response?.status;
        console.error('[AuthProvider] profile fetch error - status:', status, '| message:', error?.message);
        if (status === 401 || status === 403) {
          clearUser();
        } else if (!user) {
          // Profile fetch failed with a non-HTTP error (e.g. Zod schema mismatch) and
          // there's no cached user in the store. We can't show the dashboard without a user,
          // so clear everything to let ProtectedRoute redirect to login instead of blank page.
          clearUser();
        }
        // For other errors (network, 500, etc.) when a cached user exists, keep it —
        // they'll get a proper error on their next API call
      } finally {
        setIsLoadingProfile(false);
        setHasFetchedProfile(true);
      }
    };

    fetchUserProfile();
  }, [isHydrated, isTokenHydrated, user, hasFetchedProfile, setUser, clearUser]);

  const providerValue = useMemo(
    () => ({
      user,
      isConnected: isAuthenticated,
      isLoadingProfile,
      isTokenHydrated,
      updateUser,
      clearUser,
      getRole: () => user?.role || null,
      getUserInfo: () => user,
    }),
    [user, isAuthenticated, isLoadingProfile, isTokenHydrated, updateUser, clearUser]
  );

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
