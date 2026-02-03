import type { Package } from "./package";
import type { Bus } from "./bus";

export type PackageTripStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "open";

export interface PackageTrip {
  id: string;
  code?: number | string;
  companyId: string;
  packageId: string;
  busId: string;
  departureDate: string;
  returnDate: string;
  price: string | number;
  reservedSeats: number;
  soldSeats: number;
  status: PackageTripStatus;
  package?: Package;
  bus?: Bus;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageTripFormData {
  companyId: string;
  packageId: string;
  busId: string;
  departureDate: string;
  returnDate: string;
  price: number;
  reservedSeats?: number;
  soldSeats?: number;
}

export interface UpdatePackageTripFormData {
  busId?: string;
  departureDate?: string;
  returnDate?: string;
  price?: number;
  reservedSeats?: number;
  soldSeats?: number;
  status?: PackageTripStatus;
}
