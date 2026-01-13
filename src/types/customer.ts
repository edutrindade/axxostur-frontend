export interface CustomerType {
  id: string;
  name: string;
  companyId: string;
  email?: string;
  phone?: string;
  cpf?: string;
  document?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerFormData {
  name: string;
  companyId: string;
  email?: string;
  phone?: string;
  cpf?: string;
  document?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  active?: boolean;
}

export interface UpdateCustomerFormData {
  name?: string;
  email?: string;
  phone?: string;
  cpf?: string;
  document?: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  notes?: string;
  active?: boolean;
}
