import { api } from "./api";

export interface TenantInfo {
  id: string;
  name: string;
  cnpj: string;
  cnae: string | null;
  cnaeSecundario: string | null;
  iMendesPassword: string | null;
  fantasyName: string;
  logoUrl: string;
  notes: string;
  contactName: string;
  contactPhone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address?: AddressInfo[];
}

export interface AddressInfo {
  id: string;
  tenantId: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface UserInfo {
  id: string;
  roleId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cpf: string;
  birthDate: string | null;
  firstLogin: boolean;
  active: boolean;
  lastLoginAt: string | null;
  loginAttempts: number | null;
  passwordResetAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiClientItem {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  tenant: TenantInfo;
  user: UserInfo;
}

export interface Client {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  tenant: TenantInfo;
  user: UserInfo;
}

const mapApiClientToClient = (c: ApiClientItem): Client => ({
  id: c.id,
  tenantId: c.tenantId,
  userId: c.userId,
  name: c.name,
  phone: c.phone,
  email: c.email,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
  tenant: c.tenant,
  user: c.user,
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

export const listClients = async ({ page = 1, limit = 20, search }: ListClientsParams = {}): Promise<PaginatedClientsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;

  const { data } = await api.get<{ items: ApiClientItem[]; total: number; page: number; limit: number }>("/clients", { params });
  return {
    items: data.items.map(mapApiClientToClient),
    total: data.total,
    page: data.page,
    limit: data.limit,
  };
};

export interface CreateClientPayload {
  tenantName: string;
  tenantCnpj: string;
  tenantFantasyName: string;
  tenantLogoUrl: string;
  tenantNotes: string;
  tenantContactName: string;
  tenantContactPhone: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cpf: string;
  name: string;
}

export const createClient = async (payload: CreateClientPayload): Promise<Client> => {
  const { data } = await api.post<ApiClientItem>("/clients", payload);
  return mapApiClientToClient(data);
};

export const getClientById = async (id: string): Promise<Client> => {
  const { data } = await api.get<ApiClientItem>(`/clients/${id}`);
  return mapApiClientToClient(data);
};

export const getClientWithAddress = async (tenantId: string): Promise<AddressInfo | null> => {
  try {
    const { data } = await api.get<AddressInfo>(`/addresses/tenant/${tenantId}`);
    return data;
  } catch {
    return null;
  }
};

export interface UpdateClientPayload {
  tenantName?: string;
  tenantCnpj?: string;
  tenantFantasyName?: string;
  tenantLogoUrl?: string;
  tenantNotes?: string;
  tenantContactName?: string;
  tenantContactPhone?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  cpf?: string;
  name?: string;
}

export const updateClient = async (id: string, payload: UpdateClientPayload): Promise<Client> => {
  const { data } = await api.patch<ApiClientItem>(`/clients/${id}`, payload);
  return mapApiClientToClient(data);
};
