import { api } from "./api";

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  companyId?: string;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  companyId?: string;
  clientId?: string;
}

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const listAddresses = async (): Promise<Address[]> => {
  const response = await api.get<Address[]>("/addresses");
  return response.data;
};

export const listAddressesByCompany = async (companyId: string): Promise<Address[]> => {
  const response = await api.get<Address[]>(`/addresses/company/${companyId}`);
  return response.data;
};

export const getAddress = async (id: string): Promise<Address> => {
  const response = await api.get<Address>(`/addresses/${id}`);
  return response.data;
};

export const createAddress = async (data: CreateAddressRequest): Promise<Address> => {
  const response = await api.post<Address>("/addresses", data);
  return response.data;
};

export const updateAddress = async (id: string, data: Partial<CreateAddressRequest>): Promise<Address> => {
  const response = await api.patch<Address>(`/addresses/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};

export const fetchAddressFromViaCEP = async (zipCode: string): Promise<ViaCEPResponse> => {
  const cleanZipCode = zipCode.replace(/\D/g, "");
  const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);

  if (!response.ok) {
    throw new Error("CEP não encontrado");
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return data;
};
