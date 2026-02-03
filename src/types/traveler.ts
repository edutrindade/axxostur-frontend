export type TravelerGender = "male" | "female" | "other";

export interface Traveler {
  id: string;
  code?: number | string;
  companyId: string;
  name: string;
  cpf: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate: string;
  gender: TravelerGender;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTravelerRequest {
  companyId: string;
  name: string;
  cpf: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate: string;
  gender: TravelerGender;
  notes?: string | null;
}

export interface UpdateTravelerRequest {
  name?: string;
  cpf?: string;
  document?: string | null;
  email?: string | null;
  phone?: string | null;
  birthDate?: string;
  gender?: TravelerGender;
  notes?: string | null;
}

export interface TravelersListResponse {
  data: Traveler[];
}
