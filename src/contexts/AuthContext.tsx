import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext, type User, type AuthContextType, type Role } from "./auth";
import { login as apiLogin, logout as apiLogout, getAuthData } from "../services/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Sincronizar autenticação inicial
  useEffect(() => {
    try {
      const { user: storedUser, accessToken } = getAuthData();
      if (storedUser && accessToken) {
        setUser(storedUser);
        setRole(storedUser.role);
      }
    } catch (error) {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } finally {
      setIsInitializing(false);
    }
  }, []);

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return await apiLogin(credentials);
    },
    onSuccess: (data: any) => {
      setUser(data.user);
      setRole(data.user.role);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiLogout();
    },
    onSuccess: () => {
      setUser(null);
      setRole(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      // Mesmo em caso de erro, limpa o estado local
      setUser(null);
      setRole(null);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  });

  const value: AuthContextType = {
    user,
    role,
    company: user?.company || null,
    isAuthenticated: !!user,
    isLoading: isInitializing || loginMutation.isPending || logoutMutation.isPending,
    isSuperAdmin: user?.role === "super_admin",
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
    login: async (email: string, password: string) => {
      try {
        const data = await loginMutation.mutateAsync({ email, password });
        return { success: true, user: data.user };
      } catch {
        return { success: false };
      }
    },
    logout: () => logoutMutation.mutateAsync(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
