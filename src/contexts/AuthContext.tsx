import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext, type User, type AuthContextType, type Role } from "./auth";
import { login as apiLogin, logout as apiLogout, getAuthData } from "../services/auth";

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
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiLogin({ email, password });
      setUser(data.user);
      setRole(data.user.role);
      return true;
    } catch (error) {
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

  const value: AuthContextType = {
    user,
    role,
    isAuthenticated: !!user,
    isLoading,
    isSuperAdmin: user?.role === "super_admin",
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
