import { api } from "./api";

interface AddressData {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface PreRegistrationPayload {
  tenantName: string;
  tenantCnpj: string;
  tenantCnae: string;
  tenantCnaeSecundario?: string;
  tenantFantasyName: string;
  tenantContactName: string;
  tenantContactPhone: string;
  address: AddressData;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  cpf: string;
}

export const createPreRegistration = async (data: PreRegistrationPayload) => {
  const response = await api.post("/pre-registration", data);
  return response.data;
};
