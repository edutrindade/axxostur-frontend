import { api } from "./api";

export interface ApiTenantItem {
  id: string;
  name: string;
  cnpj: string;
  cnae: string | null;
  cnaeSecundario: string | null;
  iMendesPassword: string | null;
  fantasyName: string | null;
  logoUrl: string | null;
  notes: string | null;
  contactName: string | null;
  contactPhone: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PaginatedApiTenantsResponse {
  items: ApiTenantItem[];
  total: number;
  page: number;
  limit: number;
}

export interface Tenant {
  id: string;
  name: string;
  cnpj: string;
  fantasyName: string | null;
  contactName: string | null;
  contactPhone: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListTenantsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ListTenantsResult {
  items: Tenant[];
  total: number;
  page: number;
  limit: number;
}

const mapApiTenantToTenant = (t: ApiTenantItem): Tenant => ({
  id: t.id,
  name: t.name,
  cnpj: t.cnpj,
  fantasyName: t.fantasyName,
  contactName: t.contactName,
  contactPhone: t.contactPhone,
  active: t.active,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export async function listTenants({ page = 1, limit = 20, search }: ListTenantsParams = {}): Promise<ListTenantsResult> {
  const params: Record<string, string | number> = { page, limit };
  if (search) params.search = search;

  const { data } = await api.get<PaginatedApiTenantsResponse>("/tenants", { params });

  return {
    items: data.items.map(mapApiTenantToTenant),
    total: data.total,
    page: data.page,
    limit: data.limit,
  };
}

export interface CreateTenantData {
  name: string;
  cnpj: string;
  cnae: string | null;
  cnaeSecundario: string | null;
  fantasyName: string | null;
  logoUrl: string | null;
  notes: string | null;
  contactName: string | null;
  contactPhone: string | null;
}

export type UpdateTenantData = Partial<CreateTenantData> & { active?: boolean };

export async function getTenantById(id: string): Promise<Tenant> {
  const { data } = await api.get<ApiTenantItem>(`/tenants/${id}`);
  return mapApiTenantToTenant(data);
}

export async function createTenant(payload: CreateTenantData): Promise<Tenant> {
  const { data } = await api.post<ApiTenantItem>("/tenants", payload);
  return mapApiTenantToTenant(data);
}

export async function updateTenant(id: string, payload: UpdateTenantData): Promise<Tenant> {
  const { data } = await api.put<ApiTenantItem>(`/tenants/${id}`, payload);
  return mapApiTenantToTenant(data);
}