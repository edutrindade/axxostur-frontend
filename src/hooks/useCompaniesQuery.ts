import { useQuery } from "@tanstack/react-query";
import { listCompanies, getCompany } from "@/services/companies";
import type { Company } from "@/services/companies";

export const useCompaniesQuery = () => {
  return useQuery<Company[]>({
    queryKey: ["companies"],
    queryFn: listCompanies,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompanyQuery = (id: string) => {
  return useQuery<Company>({
    queryKey: ["companies", id],
    queryFn: () => getCompany(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
