import { api } from "./api";

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

export interface Admin {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string | null;
}

export type Role = "ADMIN" | "CLIENT";

export interface AuthResponse {
  user: User;
  role: Role;
  token: string;
  refreshToken: string;
  admin?: Admin | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const saveAuthData = (data: AuthResponse) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("role", data.role);
  localStorage.setItem("user", JSON.stringify(data.user));
  if (data.admin) {
    localStorage.setItem("admin", JSON.stringify(data.admin));
  }

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  document.cookie = `token=${data.token}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = `role=${data.role}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = `refreshToken=${data.refreshToken}; expires=${expirationDate.toUTCString()}; path=/`;
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("admin");

  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const getAuthData = (): { token: string | null; user: User | null; role: Role | null } => {
  const token = localStorage.getItem("token");
  const roleStr = localStorage.getItem("role");
  const role = (roleStr as Role) || null;
  const userStr = localStorage.getItem("user");
  const user = userStr ? (JSON.parse(userStr) as User) : null;
  return { token, user, role };
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signin", credentials);
  saveAuthData(response.data);
  return response.data;
};

export const logout = async () => {
  const { user } = getAuthData();

  if (user?.email) {
    try {
      await api.post("/auth/signout", { email: user.email });
    } catch (error) {
      console.error("Erro ao fazer signout:", error);
    }
  }

  clearAuthData();
};

export const isAuthenticated = (): boolean => {
  const { token } = getAuthData();
  return !!token;
};

export const isAdmin = (): boolean => {
  const { role } = getAuthData();
  return role === "ADMIN";
};

export const isClient = (): boolean => {
  const { role } = getAuthData();
  return role === "CLIENT";
};

export interface UpdatePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export const updateMyPassword = async (data: UpdatePasswordRequest): Promise<void> => {
  await api.patch("/users/me/password", data);
};
