"use client"

import { createContext, type ReactNode, type FC, useCallback, useEffect, useMemo, useContext, useState, useRef } from "react";
import { httpClient } from "../lib/http-client";
import { tokenManager } from "../lib/token-manager./token-manager";
import { useUserStore } from "../stores";
import { getProfile } from "../services/auth.service";
import type { Role } from "../config/enum";

// Check token expiration every minute
const TOKEN_CHECK_INTERVAL = 60 * 1000;

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
function mapProfileToUser(profile: ProfileApiResponse): User {
  // Build name from firstName + lastName if name is not provided
  const name = profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    'Utilisateur';

  return {
    id: profile.id,
    email: profile.email,
    name,
    role: profile.role,
    avatar: profile.avatar,
    phone: profile.phone,
    companyId: profile.companyId || profile.userEnterprise?.id,
  };
}

interface AuthContextType {
  user: User | null;
  isConnected: boolean;
  isLoadingProfile: boolean;
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
  const { user, isAuthenticated, setUser, clearUser: clearUserStore, isHydrated } = useUserStore();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const tokenCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearUser = useCallback(() => {
    // Clear tokens
    tokenManager.clearTokens();

    // Clear Zustand store
    clearUserStore();

    // Clear legacy localStorage
    localStorage.removeItem("caisse-post-role");
    localStorage.removeItem("user");
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

  // Continuous token expiration monitoring
  // This runs every minute to check if the token has expired
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = tokenManager.getToken();

      if (!token) {
        // No token, nothing to monitor
        return;
      }

      if (tokenManager.isTokenExpired()) {
        console.log("[AuthProvider] Token expired during monitoring, clearing user");
        clearUser();
        return;
      }

      // Log time remaining for debugging
      const timeUntilExpiry = tokenManager.getTimeUntilExpiry();
      if (timeUntilExpiry !== null) {
        const minutesRemaining = Math.floor(timeUntilExpiry / 1000 / 60);
        console.log(`[AuthProvider] Token expires in ${minutesRemaining} minutes`);
      }
    };

    // Only start monitoring if user is authenticated
    if (isAuthenticated && user) {
      // Check immediately
      checkTokenExpiration();

      // Set up interval for continuous checking
      tokenCheckIntervalRef.current = setInterval(checkTokenExpiration, TOKEN_CHECK_INTERVAL);

      console.log("[AuthProvider] Token expiration monitoring started");
    }

    return () => {
      if (tokenCheckIntervalRef.current) {
        clearInterval(tokenCheckIntervalRef.current);
        tokenCheckIntervalRef.current = null;
        console.log("[AuthProvider] Token expiration monitoring stopped");
      }
    };
  }, [isAuthenticated, user, clearUser]);

  // Fetch profile if token exists but user is not in store
  useEffect(() => {
    // Wait for store to be hydrated before making decisions
    if (!isHydrated) {
      console.log("[AuthProvider] Waiting for store hydration...");
      return;
    }

    const fetchUserProfile = async () => {
      const token = tokenManager.getToken();

      console.log("[AuthProvider] fetchUserProfile check:", {
        hasToken: !!token,
        hasUser: !!user,
        hasFetchedProfile,
        isHydrated,
        tokenExpired: token ? tokenManager.isTokenExpired() : null,
      });

      // Skip if we already have a user or already attempted fetch
      if (user || hasFetchedProfile) {
        console.log("[AuthProvider] Skipping fetch - already have user or already fetched");
        return;
      }

      // No token = no fetch needed
      if (!token) {
        console.log("[AuthProvider] No token found");
        setHasFetchedProfile(true);
        return;
      }

      // Check if token is expired
      if (tokenManager.isTokenExpired()) {
        console.log("[AuthProvider] Token expired, clearing user");
        clearUser();
        setHasFetchedProfile(true);
        return;
      }

      console.log("[AuthProvider] Fetching profile...");
      setIsLoadingProfile(true);
      try {
        const profileData = await getProfile() as ProfileApiResponse | null;
        console.log("[AuthProvider] Profile data received:", profileData);
        if (profileData && profileData.id && profileData.email) {
          const mappedUser = mapProfileToUser(profileData);
          console.log("[AuthProvider] Mapped user data:", mappedUser);
          setUser(mappedUser);
          console.log("[AuthProvider] User set successfully");
        } else {
          // Profile fetch returned invalid data, clear user
          console.log("[AuthProvider] Invalid profile data, clearing user");
          clearUser();
        }
      } catch (error) {
        console.error("[AuthProvider] Failed to fetch user profile:", error);
        clearUser();
      } finally {
        setIsLoadingProfile(false);
        setHasFetchedProfile(true);
      }
    };

    fetchUserProfile();
  }, [isHydrated, user, hasFetchedProfile, setUser, clearUser]);

  const providerValue = useMemo(
    () => ({
      user,
      isConnected: isAuthenticated,
      isLoadingProfile,
      updateUser,
      clearUser,
      getRole: () => user?.role || null,
      getUserInfo: () => user,
    }),
    [user, isAuthenticated, isLoadingProfile, updateUser, clearUser]
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
