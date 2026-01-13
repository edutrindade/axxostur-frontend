export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: "admin" | "attendant" | "super_admin";
  companyId: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  role: "admin" | "attendant" | "super_admin";
  companyId?: string;
  password?: string;
}

export interface UpdateUserFormData {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  role?: "admin" | "attendant" | "super_admin";
  companyId?: string | null;
  password?: string;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsersListResponse {
  data: User[];
  pagination: PaginationData;
}
