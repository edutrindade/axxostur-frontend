import type { Hotel } from "@/services/hotels";

export interface Package {
  id: string;
  companyId: string;
  hotelId: string;
  name: string;
  description?: string;
  nights: number;
  includesBreakfast: boolean;
  includesLunch: boolean;
  includesDinner: boolean;
  includesTours: boolean;
  openFood: boolean;
  includesFood: boolean;
  includesTransfer: boolean;
  includesInsurance: boolean;
  active: boolean;
  hotel?: Hotel;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageFormData {
  name: string;
  description?: string;
  companyId: string;
  hotelId: string;
  nights: number;
  includesBreakfast: boolean;
  includesLunch: boolean;
  includesDinner: boolean;
  includesTours: boolean;
  openFood: boolean;
  includesFood: boolean;
  includesTransfer: boolean;
  includesInsurance: boolean;
}

export interface UpdatePackageFormData {
  name?: string;
  description?: string;
  hotelId?: string;
  nights?: number;
  includesBreakfast?: boolean;
  includesLunch?: boolean;
  includesDinner?: boolean;
  includesTours?: boolean;
  openFood?: boolean;
  includesFood?: boolean;
  includesTransfer?: boolean;
  includesInsurance?: boolean;
  active?: boolean;
}
