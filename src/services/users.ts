import { api } from "./api";

export interface ApiUserItem {
  id: string;
  roleId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string;
  cpf: string | null;
  birthDate: string | null;
  firstLogin: boolean;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roleName: string;
}

export interface PaginatedApiUsersResponse {
  items: ApiUserItem[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  birthdate?: string | Date;
  cpf?: string;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string;
  birthdate?: string | Date;
  cpf?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthdate?: string | Date;
  cpf?: string;
}

interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  cpf?: string;
}

export interface SendWelcomeEmailData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePasswordData {
  userId: string;
  newPassword: string;
}

const mapApiUserToUser = (apiUser: ApiUserItem): User => {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    phone: apiUser.phone ?? undefined,
    role: apiUser.roleName,
    birthdate: apiUser.birthDate ?? undefined,
    cpf: apiUser.cpf ?? undefined,
    active: apiUser.active,
    createdAt: apiUser.createdAt,
    lastLoginAt: apiUser.lastLoginAt,
  };
};

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "ADMIN" | "CLIENT";
}

export interface PaginatedUsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export const listUsers = async ({ page = 1, limit = 20, search, role }: ListUsersParams = {}): Promise<PaginatedUsersResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (search) params.append("search", search);
  if (role) params.append("role", role);

  const response = await api.get<PaginatedApiUsersResponse>(`/users?${params.toString()}`);
  const { items, total, page: respPage, limit: respLimit } = response.data;
  return {
    items: items.map(mapApiUserToUser),
    total,
    page: respPage,
    limit: respLimit,
  };
};

export const getUsers = async (): Promise<User[]> => {
  const pageData = await listUsers({ page: 1, limit: 20 });
  return pageData.items;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<ApiUserItem>(`/users/${id}`);
  return mapApiUserToUser(response.data);
};

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const response = await api.post<ApiUserItem>("/users", userData);
  return mapApiUserToUser(response.data);
};

export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  const payload: UpdateUserPayload = {};

  if (userData.firstName !== undefined) payload.firstName = userData.firstName;
  if (userData.lastName !== undefined) payload.lastName = userData.lastName;
  if (userData.email !== undefined) payload.email = userData.email;
  if (userData.phone !== undefined) payload.phone = userData.phone;
  if (userData.cpf !== undefined) payload.cpf = userData.cpf;
  if (userData.birthdate !== undefined) {
    payload.birthDate = typeof userData.birthdate === "string" ? userData.birthdate : userData.birthdate.toISOString();
  }

  const response = await api.patch<ApiUserItem>(`/users/${id}`, payload);
  return mapApiUserToUser(response.data);
};

export const sendWelcomeEmail = async (data: SendWelcomeEmailData): Promise<void> => {
  await api.post("/users/send-welcome-email", data);
};

export const updateUserPassword = async (data: UpdatePasswordData): Promise<void> => {
  await api.post("/users/update-password", data);
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
export interface Prospector {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

export interface CreateProspectorData {
  name: string;
  email: string;
  phone?: string;
}

export interface UpdateProspectorData {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export const createProspector = async (prospectorData: CreateProspectorData): Promise<Prospector> => {
  const response = await api.post("/users/prospectors", prospectorData);
  return response.data;
};

export const getProspectors = async (): Promise<Prospector[]> => {
  const response = await api.get("/users/prospectors");
  return response.data;
};

export const getProspectorById = async (id: string): Promise<Prospector> => {
  const response = await api.get(`/users/prospectors/${id}`);
  return response.data;
};

export const updateProspector = async (id: string, prospectorData: UpdateProspectorData): Promise<Prospector> => {
  const response = await api.put(`/users/prospectors/${id}`, prospectorData);
  return response.data;
};

export const deleteProspector = async (id: string): Promise<void> => {
  await api.delete(`/users/prospectors/${id}`);
};

export const toggleProspectorStatus = async (id: string, active: boolean): Promise<Prospector> => {
  const response = await api.patch(`/users/prospectors/${id}/status`, { active });
  return response.data;
};
