import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { AuthContext, type User, type AuthContextType, type Role } from "./auth";
import { login as apiLogin, logout as apiLogout, getAuthData, isAdmin as checkIsAdmin, isClient as checkIsClient, getTenantId } from "../services/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const { user: storedUser, token, role: storedRole } = getAuthData();

        if (storedUser && token) {
          setUser(storedUser);
          setRole(storedRole);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: apiLogin,
    onSuccess: (data) => {
      setUser(data.user);
      setRole(data.role);
    },
    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  const updateUserFirstLogin = () => {
    if (user) {
      const updatedUser = { ...user, firstLogin: false };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    role,
    tenantId: getTenantId(),
    isAuthenticated: !!user,
    isLoading: isLoading || loginMutation.isPending,
    isAdmin: checkIsAdmin(),
    isClient: checkIsClient(),
    // Alias temporário para manter compatibilidade com páginas que usam isSuperAdmin
    isSuperAdmin: checkIsAdmin(),
    login,
    logout,
    updateUserFirstLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
