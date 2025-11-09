import { api } from "./api";

export interface ApiClientItem {
  id: string;
  tenantName: string;
  tenantCnpj: string;
  tenantFantasyName: string | null;
  tenantLogoUrl: string | null;
  tenantNotes: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  firstName: string;
  lastName: string | null;
  phone: string | null;
  email: string;
  cpf: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  tenantName: string;
  tenantCnpj: string;
  tenantFantasyName?: string;
  tenantLogoUrl?: string;
  tenantNotes?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  email: string;
  cpf?: string;
  active: boolean;
  createdAt: string;
}

const mapApiClientToClient = (c: ApiClientItem): Client => ({
  id: c.id,
  tenantName: c.tenantName,
  tenantCnpj: c.tenantCnpj,
  tenantFantasyName: c.tenantFantasyName ?? undefined,
  tenantLogoUrl: c.tenantLogoUrl ?? undefined,
  tenantNotes: c.tenantNotes ?? undefined,
  street: c.street ?? undefined,
  number: c.number ?? undefined,
  complement: c.complement ?? undefined,
  neighborhood: c.neighborhood ?? undefined,
  city: c.city ?? undefined,
  state: c.state ?? undefined,
  country: c.country ?? undefined,
  zipCode: c.zipCode ?? undefined,
  firstName: c.firstName,
  lastName: c.lastName ?? undefined,
  phone: c.phone ?? undefined,
  email: c.email,
  cpf: c.cpf ?? undefined,
  active: c.active,
  createdAt: c.createdAt,
});

export interface ListClientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedClientsResponse {
  items: Client[];
  total: number;
  page: number;
  limit: number;
}

export const listClients = async (
  { page = 1, limit = 20, search }: ListClientsParams = {}
): Promise<PaginatedClientsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;

  const { data } = await api.get<ApiClientItem[]>("/clients", { params });
  const total = Array.isArray(data) ? data.length : 0;
  return {
    items: (Array.isArray(data) ? data : []).map(mapApiClientToClient),
    total,
    page,
    limit,
  };
};

export interface CreateClientPayload {
  tenantName: string;
  tenantCnpj: string;
  tenantFantasyName: string;
  tenantLogoUrl: string;
  tenantNotes: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cpf: string;
}

export const createClient = async (
  payload: CreateClientPayload
): Promise<Client> => {
  const { data } = await api.post<ApiClientItem>("/clients", payload);
  return mapApiClientToClient(data);
};

export const getClientById = async (id: string): Promise<Client> => {
  const { data } = await api.get<ApiClientItem>(`/clients/${id}`);
  return mapApiClientToClient(data);
};