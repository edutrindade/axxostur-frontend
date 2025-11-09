import { api } from "./api";

export interface Enterprise {
	id: string;
	cnpj: string;
	stateRegistration?: string;
	socialReason: string;
	fantasyName?: string;
	responsibleName?: string;
	responsibleCrea?: string;
	phone?: string;
	email: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	instagram?: string;
	facebook?: string;
	logoUrl?: string;
	primaryColor?: string;
	secondaryColor?: string;
	accentColor?: string;
	customDomain?: string;
	language?: string;
	invoiceDueDate?: number;
	invoiceEmail?: string;
	active: boolean;
	status?: string;
	planType?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateEnterpriseData {
	cnpj: string;
	stateRegistration?: string;
	socialReason: string;
	fantasyName?: string;
	responsibleName?: string;
	responsibleCrea?: string;
	phone?: string;
	email: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	instagram?: string;
	facebook?: string;
	logoUrl?: string;
	primaryColor?: string;
	secondaryColor?: string;
	accentColor?: string;
	customDomain?: string;
	language?: string;
	invoiceDueDate?: number;
	invoiceEmail?: string;
}

export interface UpdateEnterpriseData {
	cnpj?: string;
	stateRegistration?: string;
	socialReason?: string;
	fantasyName?: string;
	responsibleName?: string;
	responsibleCrea?: string;
	phone?: string;
	email?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	instagram?: string;
	facebook?: string;
	logoUrl?: string;
	primaryColor?: string;
	secondaryColor?: string;
	accentColor?: string;
	customDomain?: string;
	language?: string;
	invoiceDueDate?: number;
	invoiceEmail?: string;
	active?: boolean;
	planType?: string;
}

export interface ListEnterprisesParams {
	page?: number;
	limit?: number;
	search?: string;
}

export interface PaginationData {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface ListEnterprisesResponse {
	data: Enterprise[];
	pagination: PaginationData;
}

// Listar enterprises com paginação
export const getEnterprises = async ({
	page = 1,
	limit = 10,
	search,
}: ListEnterprisesParams = {}): Promise<ListEnterprisesResponse> => {
	const params = new URLSearchParams();
	params.append("page", page.toString());
	params.append("limit", limit.toString());
	if (search) {
		params.append("search", search);
	}

	const response = await api.get(`/enterprises?${params.toString()}`);
	return response.data;
};

// Buscar enterprise por ID
export const getEnterpriseById = async (id: string): Promise<Enterprise> => {
	const response = await api.get(`/enterprises/${id}`);
	return response.data;
};

// Criar enterprise
export const createEnterprise = async (
	enterpriseData: CreateEnterpriseData,
): Promise<Enterprise> => {
	const response = await api.post("/enterprises", enterpriseData);
	return response.data;
};

// Atualizar enterprise
export const updateEnterprise = async (
	id: string,
	enterpriseData: UpdateEnterpriseData,
): Promise<Enterprise> => {
	const response = await api.put(`/enterprises/${id}`, enterpriseData);
	return response.data;
};
