import { useQuery } from "@tanstack/react-query";
import { listHotels, listHotelsByCompany, getHotel } from "@/services/hotels";
import type { Hotel, HotelsListResponse } from "@/services/hotels";

export const useHotelsQuery = (page: number = 1, limit: number = 20) => {
  return useQuery<HotelsListResponse>({
    queryKey: ["hotels", page, limit],
    queryFn: () => listHotels(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useHotelsByCompanyQuery = (companyId: string, page: number = 1, limit: number = 20, name?: string) => {
  return useQuery<HotelsListResponse>({
    queryKey: ["hotels", companyId, page, limit, name],
    queryFn: () => listHotelsByCompany(companyId, page, limit, name),
    enabled: !!companyId,
    staleTime: 0,
    refetchOnMount: true,
  });
};

export const useHotelQuery = (id: string) => {
  return useQuery<Hotel>({
    queryKey: ["hotels", id],
    queryFn: () => getHotel(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
