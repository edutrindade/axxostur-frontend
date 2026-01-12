export interface AddressType {
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

export interface CreateAddressFormData {
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

export interface ViaCEPAddressData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}
