export interface Bus {
  id: string;
  name: string;
  plate: string;
  companyId: string;
  totalSeats: number;
  type: "conventional" | "semi_bed" | "bed" | "bed_cabin";
  hasBathroom?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusFormData {
  name: string;
  plate: string;
  companyId: string;
  totalSeats: number;
  type: "conventional" | "semi_bed" | "bed" | "bed_cabin";
}

export interface UpdateBusFormData {
  name?: string;
  plate?: string;
  totalSeats?: number;
  type?: "conventional" | "semi_bed" | "bed" | "bed_cabin";
  active?: boolean;
}
