import { useQuery } from "@tanstack/react-query";
import { getBusesByCompany } from "@/services/buses";
import { useAuth } from "./useAuth";

export const useBusesByCompanyQuery = (companyId: string, page: number = 1, limit: number = 20, search?: string) => {
  return useQuery({
    queryKey: ["buses", companyId, page, limit, search],
    queryFn: () => getBusesByCompany(companyId, page, limit, search),
    enabled: !!companyId,
  });
};

export const useBusesQuery = (page: number = 1, limit: number = 20, search?: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["buses", user?.companyId, page, limit, search],
    queryFn: () => getBusesByCompany(user?.companyId || "", page, limit, search),
    enabled: !!user?.companyId,
  });
};
