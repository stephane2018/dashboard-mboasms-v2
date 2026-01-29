"use client"

import { createContext, type ReactNode, type FC, useCallback, useEffect, useMemo, useContext, useState } from "react";
import { httpClient } from "../lib/http-client";
import { tokenManager } from "../lib/token-manager./token-manager";
import { useUserStore } from "../stores";
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
  const { user, isAuthenticated, setUser, clearUser: clearUserStore } = useUserStore();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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

  useEffect(() => {
    const interceptorId = httpClient.catchUnauthorizedResponse(clearUser);

    return () => {
      if (interceptorId) {
        httpClient.rejectResponseInterceptor(interceptorId);
      }
    };
  }, [clearUser]);

  // Fetch profile if token exists but user is not in store
  // Use a separate state to track if we've attempted to fetch
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);

  useEffect(() => {
    // Run only on client-side after mount
    const fetchUserProfile = async () => {
      const token = tokenManager.getToken();

      console.log("[AuthProvider] fetchUserProfile check:", {
        hasToken: !!token,
        hasUser: !!user,
        hasFetchedProfile,
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
        const profileData = await getProfile() as User | null;
        console.log("[AuthProvider] Profile data received:", profileData);
        if (profileData && profileData.id && profileData.email) {
          setUser(profileData);
          console.log("[AuthProvider] User set successfully");
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
  }, [user, hasFetchedProfile, setUser, clearUser]);

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
