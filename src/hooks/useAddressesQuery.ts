import { useQuery } from "@tanstack/react-query";
import { listAddresses, listAddressesByCompany, getAddress } from "@/services/addresses";
import type { Address } from "@/services/addresses";

export const useAddressesQuery = () => {
  return useQuery<Address[]>({
    queryKey: ["addresses"],
    queryFn: listAddresses,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddressesByCompanyQuery = (companyId: string) => {
  return useQuery<Address[]>({
    queryKey: ["addresses", companyId],
    queryFn: () => listAddressesByCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddressQuery = (id: string) => {
  return useQuery<Address>({
    queryKey: ["addresses", id],
    queryFn: () => getAddress(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
