export interface HotelType {
  id: string;
  name: string;
  companyId: string;
  addressId?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  internalNotes?: string;
  totalRooms?: number;
  stars?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHotelFormData {
  name: string;
  companyId: string;
  addressId?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  internalNotes?: string;
  totalRooms?: number;
  stars?: number;
}

export interface UpdateHotelFormData {
  name?: string;
  addressId?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  checkInTime?: string;
  checkOutTime?: string;
  internalNotes?: string;
  totalRooms?: number;
  stars?: number;
  active?: boolean;
}
