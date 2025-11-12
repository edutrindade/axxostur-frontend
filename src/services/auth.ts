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

export interface Client {
  id: string;
  userId: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type Role = "ADMIN" | "CLIENT";

export interface AuthResponse {
  user: User;
  role: Role;
  token: string;
  refreshToken: string;
  admin?: Admin | null;
  client?: Client | null;
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
  if (data.client) {
    localStorage.setItem("client", JSON.stringify(data.client));
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
  localStorage.removeItem("client");

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

export const getTenantId = (): string | null => {
  const { role } = getAuthData();

  if (role === "ADMIN") {
    const adminStr = localStorage.getItem("admin");
    if (adminStr) {
      const admin = JSON.parse(adminStr) as Admin;
      return admin.tenantId;
    }
  } else if (role === "CLIENT") {
    const clientStr = localStorage.getItem("client");
    if (clientStr) {
      const client = JSON.parse(clientStr) as Client;
      return client.tenantId;
    }
  }

  return null;
};

export interface UpdatePasswordRequest {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}

export const updateMyPassword = async (data: UpdatePasswordRequest): Promise<void> => {
  await api.patch("/users/me/password", data);
};

export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<void> => {
  await api.post("/auth/forgot-password", data);
};

export interface ConfirmRecoveryCodeRequest {
  email: string;
  code: string;
}

export const confirmRecoveryCode = async (data: ConfirmRecoveryCodeRequest): Promise<void> => {
  await api.post("/auth/confirm-recovery-code", data);
};

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export const resetPassword = async (data: ResetPasswordRequest): Promise<void> => {
  await api.post("/auth/reset-password", data);
};
