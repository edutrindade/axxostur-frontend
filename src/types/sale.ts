export type SaleStatus = "reserved" | "confirmed" | "cancelled";
export type PaymentMethod = "credit_card" | "debit_card" | "cash" | "check" | "pix" | "bank_slip";

export interface Sale {
  id: string;
  companyId: string;
  clientId: string;
  userId: string;
  packageTripId: string;
  status: SaleStatus;
  totalValue: number;
  discount?: number;
  addition?: number;
  finalValue?: number;
  paymentMethod?: PaymentMethod;
  installments?: number;
  interestRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaleTraveler {
  id: string;
  saleId: string;
  travelerId: string;
  seatNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleRequest {
  companyId: string;
  clientId: string;
  userId: string;
  packageTripId: string;
  status: SaleStatus;
  totalValue: number;
  discount?: number;
  addition?: number;
}

export interface UpdateSaleRequest {
  status?: SaleStatus;
  discount?: number;
  addition?: number;
  paymentMethod?: PaymentMethod;
  installments?: number;
  interestRate?: number;
}

export interface CreateSaleTravelerRequest {
  saleId: string;
  travelerId: string;
  seatNumber: number;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SalesListResponse {
  data: Sale[];
  pagination: PaginationData;
}
