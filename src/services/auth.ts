import { api } from "./api";

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
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UpdateProfileRequest {
  cpf?: string;
  phone?: string;
  name?: string;
  password?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const saveAuthData = (data: AuthResponse) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("user", JSON.stringify(data.user));

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 7);

  document.cookie = `accessToken=${data.accessToken}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = `refreshToken=${data.refreshToken}; expires=${expirationDate.toUTCString()}; path=/`;
};

export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const getAuthData = (): { accessToken: string | null; user: User | null } => {
  const accessToken = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("user");
  const user = userStr ? (JSON.parse(userStr) as User) : null;
  return { accessToken, user };
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  saveAuthData(response.data);
  return response.data;
};

export const register = async (data: { name: string; email: string; password: string; phone: string; role: "super_admin" | "admin" | "attendant" }): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  saveAuthData(response.data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout", {});
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  } finally {
    clearAuthData();
  }
};

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>("/auth/profile");
  return response.data;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await api.patch<User>("/auth/profile", data);
  const user = response.data;
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
  await api.post("/auth/change-password", data);
};

export const refreshAccessToken = async (): Promise<AuthResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Refresh token não encontrado");
  }

  const response = await api.post<AuthResponse>("/auth/refresh", { refreshToken });
  saveAuthData(response.data);
  return response.data;
};
