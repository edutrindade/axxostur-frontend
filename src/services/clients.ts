import { api } from "./api";

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

export interface RoleInfo {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantInfo {
  id: string;
  name: string;
  cnpj: string;
  cnae: string | null;
  cnaeSecundario: string | null;
  iMendesPassword: string | null;
  fantasyName: string;
  logoUrl: string | null;
  notes: string | null;
  contactName: string;
  contactPhone: string;
  approved: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address?: AddressInfo;
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
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  role: RoleInfo;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  tenant: TenantInfo;
}

export interface Client {
  id: string;
  userId: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cpf: string;
  role: RoleInfo;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  tenant: TenantInfo;
}

const mapApiClientToClient = (c: ApiClientItem): Client => ({
  id: c.id,
  userId: c.userId,
  tenantId: c.tenantId,
  firstName: c.firstName,
  lastName: c.lastName,
  email: c.email,
  phone: c.phone,
  cpf: c.cpf,
  role: c.role,
  active: c.active,
  lastLoginAt: c.lastLoginAt,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
  tenant: c.tenant,
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
  tenantCnae?: string;
  tenantCnaeSecundario?: string;
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

export const listPendingClients = async ({ page = 1, limit = 20, search }: ListClientsParams = {}): Promise<PaginatedClientsResponse> => {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;

  const { data } = await api.get<{ items: ApiClientItem[]; total: number; page: number; limit: number }>("/clients", { params });

  const pendingClients = data.items.filter((item) => !item.tenant.approved && item.tenant.deletedAt === null);

  return {
    items: pendingClients.map(mapApiClientToClient),
    total: pendingClients.length,
    page: data.page,
    limit: data.limit,
  };
};

export const approveClient = async (tenantId: string): Promise<void> => {
  await api.patch(`/tenants/${tenantId}/approve`);
};

export const rejectClient = async (tenantId: string): Promise<void> => {
  await api.patch(`/tenants/${tenantId}/reject`);
};
