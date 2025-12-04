"use client"

import { createContext, type ReactNode, type FC, useCallback, useEffect, useMemo, useContext } from "react";
import { httpClient } from "../lib/http-client";
import { tokenManager } from "../lib/token-manager./token-manager";
import { useUserStore } from "../stores";
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

  const providerValue = useMemo(
    () => ({
      user,
      isConnected: isAuthenticated,
      isLoadingProfile: false,
      updateUser,
      clearUser,
      getRole: () => user?.role || null,
      getUserInfo: () => user,
    }),
    [user, isAuthenticated, updateUser, clearUser]
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
