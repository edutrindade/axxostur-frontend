import { api } from "./api";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "admin" | "attendant";
  companyId: string;
  active: boolean;
  phone: string;
  cpf: string;
  firstAccess: boolean;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    cnpj?: string;
    responsible?: string;
    fantasyName: string;
    logoUrl: string;
    email?: string;
    primaryColor?: string;
    secondaryColor?: string;
    tertiaryColor?: string;
  };
}

export interface UpdateProfileRequest {
  name: string;
  phone: string;
  cpf: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await api.patch("/auth/profile", data);
  return response.data;
};
