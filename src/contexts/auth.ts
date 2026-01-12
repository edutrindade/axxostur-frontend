import { createContext } from "react";

export interface Company {
  id: string;
  name: string;
  fantasyName: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  role: "super_admin" | "admin" | "attendant";
  companyId?: string;
  firstAccess?: boolean;
  createdAt: string;
  updatedAt: string;
  company?: Company;
}

export type Role = "super_admin" | "admin" | "attendant";

export interface AuthContextType {
  user: User | null;
  role: Role | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
