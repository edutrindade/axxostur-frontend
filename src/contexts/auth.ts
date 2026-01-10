import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  role: "super_admin" | "admin" | "attendant";
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export type Role = "super_admin" | "admin" | "attendant";

export interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
