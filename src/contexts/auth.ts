import { createContext } from "react";

export interface User {
  id: string;
  roleId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cpf: string;
  birthDate: string | null;
  firstLogin: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Role = "ADMIN" | "CLIENT";

export interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isClient: boolean;
  // Temporário: manter enquanto páginas antigas usam esta flag
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
