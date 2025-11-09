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
	name: string;
	email: string;
	phone?: string;
	role?: string;
	birthdate?: string | Date;
	cpfCnpj?: string;
	commission?: number;
	localManagerId?: string;
	active: boolean;
	createdAt: string;
	lastLoginAt?: string | null;
}

export interface CreateUserData {
	name: string;
	email: string;
	password?: string;
	phone?: string;
	role?: string;
	birthdate?: string | Date;
	cpfCnpj?: string;
	commission?: number;
	localManagerId?: string;
}

export interface UpdateUserData {
	name?: string;
	email?: string;
	phone?: string;
	role?: string;
	birthdate?: string | Date;
	cpfCnpj?: string;
	commission?: number;
	localManagerId?: string;
	active?: boolean;
}

export interface SendWelcomeEmailData {
	userId: string;
	email: string;
	name: string;
}

export interface UpdatePasswordData {
	userId: string;
	newPassword: string;
}

const mapApiUserToUser = (apiUser: ApiUserItem): User => {
	return {
		id: apiUser.id,
		name: `${apiUser.firstName}${apiUser.lastName ? ` ${apiUser.lastName}` : ""}`.trim(),
		email: apiUser.email,
		phone: apiUser.phone ?? undefined,
		role: apiUser.roleName,
		birthdate: apiUser.birthDate ?? undefined,
		cpfCnpj: apiUser.cpf ?? undefined,
		active: apiUser.active,
		createdAt: apiUser.createdAt,
		lastLoginAt: apiUser.lastLoginAt,
	};
};

export interface ListUsersParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface PaginatedUsersResponse {
	items: User[];
	total: number;
	page: number;
	limit: number;
}

export const listUsers = async (
	{ page = 1, limit = 20, search }: ListUsersParams = {},
): Promise<PaginatedUsersResponse> => {
	const params = new URLSearchParams();
	params.append("page", page.toString());
	params.append("limit", limit.toString());
	if (search) params.append("search", search);

	const response = await api.get<PaginatedApiUsersResponse>(
		`/users?${params.toString()}`,
	);
	const { items, total, page: respPage, limit: respLimit } = response.data;
	return {
		items: items.map(mapApiUserToUser),
		total,
		page: respPage,
		limit: respLimit,
	};
};

// Compat: manter getUsers retornando apenas lista para usos existentes
export const getUsers = async (): Promise<User[]> => {
	const pageData = await listUsers({ page: 1, limit: 20 });
	return pageData.items;
};

// Buscar usuário por ID
export const getUserById = async (id: string): Promise<User> => {
	const response = await api.get<ApiUserItem>(`/users/${id}`);
	return mapApiUserToUser(response.data);
};

// Criar usuário (super-admin)
export const createUser = async (userData: CreateUserData): Promise<User> => {
	const response = await api.post<ApiUserItem>("/users", userData);
	return mapApiUserToUser(response.data);
};

// Atualizar usuário
export const updateUser = async (
	id: string,
	userData: UpdateUserData,
): Promise<User> => {
	const response = await api.put<ApiUserItem>(`/users/${id}`, userData);
	return mapApiUserToUser(response.data);
};

// Ativar/Inativar usuário
// Removido: alternância de status de usuário conforme especificação

// Enviar email de boas-vindas
export const sendWelcomeEmail = async (
	data: SendWelcomeEmailData,
): Promise<void> => {
	await api.post("/users/send-welcome-email", data);
};

// Atualizar senha do usuário
export const updateUserPassword = async (
	data: UpdatePasswordData,
): Promise<void> => {
	await api.post("/users/update-password", data);
};

// Excluir usuário
export const deleteUser = async (id: string): Promise<void> => {
	await api.delete(`/users/${id}`);
};

// Prospector endpoints (mantidos conforme estrutura atual)
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

export const createProspector = async (
	prospectorData: CreateProspectorData,
): Promise<Prospector> => {
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

export const updateProspector = async (
	id: string,
	prospectorData: UpdateProspectorData,
): Promise<Prospector> => {
	const response = await api.put(`/users/prospectors/${id}`, prospectorData);
	return response.data;
};

export const deleteProspector = async (id: string): Promise<void> => {
	await api.delete(`/users/prospectors/${id}`);
};

export const toggleProspectorStatus = async (
	id: string,
	active: boolean,
): Promise<Prospector> => {
	const response = await api.patch(`/users/prospectors/${id}/status`, { active });
	return response.data;
};
