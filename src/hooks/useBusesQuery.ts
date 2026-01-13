import { useQuery } from "@tanstack/react-query";
import { getBusesByCompany } from "@/services/buses";

export const useBusesByCompanyQuery = (companyId: string, page: number = 1, limit: number = 20, search?: string) => {
  return useQuery({
    queryKey: ["buses", companyId, page, limit, search],
    queryFn: () => getBusesByCompany(companyId, page, limit, search),
    enabled: !!companyId,
  });
};
