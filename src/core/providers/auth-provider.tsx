"use client"

import { createContext, type ReactNode, type FC, useCallback, useEffect, useMemo, useContext, useRef, useState } from "react";
import { httpClient } from "../lib/http-client";
import { tokenManager } from "../lib/token-manager/token-manager";
import { useUserStore } from "../stores";
import { useEnterpriseStore } from "../stores/enterpriseStore";
import { useLanguageStore } from "../stores/languageStore";
import { getProfile, getEmailFromToken } from "../services/auth.service";
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
  const hydrateEffectCount = useRef(0);
  const interceptorEffectCount = useRef(0);
  const profileEffectCount = useRef(0);

  // Hydrate both Zustand store (sessionStorage) and tokens (httpOnly cookies) after mount.
  // Both are done here in a single useEffect to avoid React Error #300:
  // Zustand v5 with synchronous storage fires onRehydrateStorage synchronously during the
  // first useUserStore() call (during render), which calls set() and notifies subscribers
  // while a component is rendering. By using skipHydration:true in the store and calling
  // rehydrate() here, we ensure all state updates happen safely after render.
  useEffect(() => {
    hydrateEffectCount.current++
    console.log(`[AuthProvider] hydrate useEffect fires #${hydrateEffectCount.current}`)
    if (hydrateEffectCount.current > 3) console.error('[AuthProvider] POSSIBLE LOOP - hydrate useEffect fires too many times')
    Promise.all([
      useUserStore.persist.rehydrate(),
      useEnterpriseStore.persist.rehydrate(),
      useLanguageStore.persist.rehydrate(),
      tokenManager.hydrateFromServer(),
    ]).then(() => {
      // If the user never explicitly chose a language, use the browser's language
      const { userHasChosen, _syncBrowserLang } = useLanguageStore.getState();
      if (!userHasChosen) {
        _syncBrowserLang();
      }
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
    interceptorEffectCount.current++
    console.log(`[AuthProvider] interceptor useEffect fires #${interceptorEffectCount.current} (clearUser ref changed)`)
    if (interceptorEffectCount.current > 5) console.error('[AuthProvider] POSSIBLE LOOP - interceptor useEffect fires too many times')
    const interceptorId = httpClient.catchUnauthorizedResponse(clearUser);

    return () => {
      if (interceptorId) {
        httpClient.rejectResponseInterceptor(interceptorId);
      }
    };
  }, [clearUser]);

  // Sync profile from API after hydration:
  // - If user is in sessionStorage: use their email to fetch & compare (handles profile updates)
  // - If no user but token exists: decode email from JWT to fetch & store
  // - Only update the store if the fetched data differs from what's cached
  useEffect(() => {
    profileEffectCount.current++
    console.log(`[AuthProvider] profile useEffect fires #${profileEffectCount.current}`, { isHydrated, isTokenHydrated, hasUser: !!user, hasFetchedProfile })
    if (profileEffectCount.current > 10) console.error('[AuthProvider] POSSIBLE LOOP - profile useEffect fires too many times')

    if (!isHydrated || !isTokenHydrated) return;
    if (hasFetchedProfile) return;

    const syncUserProfile = async () => {
      // If the user just logged in, data is already fresh — skip the sync and clear the flag
      if (sessionStorage.getItem('profile-fresh') === '1') {
        sessionStorage.removeItem('profile-fresh')
        console.log('[AuthProvider] profile-fresh flag detected — skipping sync (just logged in)')
        setHasFetchedProfile(true)
        return
      }

      const token = tokenManager.getToken();

      // No token → not authenticated, nothing to do
      if (!token) {
        setHasFetchedProfile(true);
        return;
      }

      // Resolve email: prefer sessionStorage user, fallback to JWT payload
      const email = user?.email || getEmailFromToken(token);
      if (!email) {
        console.error('[AuthProvider] No email available (no user in session, no email in JWT)');
        setHasFetchedProfile(true);
        return;
      }

      setIsLoadingProfile(true);
      try {
        const profileData = await getProfile(email) as ProfileApiResponse | null;

        if (!profileData || !isValidProfile(profileData)) {
          console.error('[AuthProvider] profile invalid or null:', JSON.stringify(profileData));
          // If we have a cached user, keep it — bad response doesn't mean session is invalid
          if (!user) clearUser();
          return;
        }

        const fetched = mapProfileToUser(profileData);

        // If no cached user, store directly
        if (!user) {
          console.log('[AuthProvider] no cached user — storing fetched profile:', { id: fetched.id, email: fetched.email, role: fetched.role });
          setUser(fetched);
          return;
        }

        // Compare fetched data with cached — update only if something changed
        const hasChanged =
          fetched.id !== user.id ||
          fetched.email !== user.email ||
          fetched.name !== user.name ||
          fetched.role !== user.role ||
          fetched.avatar !== user.avatar ||
          fetched.phone !== user.phone ||
          fetched.companyId !== user.companyId;

        if (hasChanged) {
          console.log('[AuthProvider] profile changed — updating store', { before: { name: user.name, role: user.role }, after: { name: fetched.name, role: fetched.role } });
          setUser(fetched);
        } else {
          console.log('[AuthProvider] profile unchanged — keeping cached user');
        }
      } catch (error: any) {
        const status = error?.response?.status;
        console.error('[AuthProvider] profile fetch error - status:', status, '| message:', error?.message);
        if (status === 401 || status === 403) {
          clearUser();
        }
        // For other errors (500, network, etc.): keep the cached user if any
        if (!user) clearUser();
      } finally {
        setIsLoadingProfile(false);
        setHasFetchedProfile(true);
      }
    };

    syncUserProfile();
  }, [isHydrated, isTokenHydrated, hasFetchedProfile, setUser, clearUser]);

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
