import { useQuery } from "@tanstack/react-query";
import { getPackages, getPackagesByCompany } from "@/services/packages";
import { useAuth } from "./useAuth";

export const usePackagesQuery = (page: number = 1, limit: number = 20, search?: string) => {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "super_admin";

  return useQuery({
    queryKey: ["packages", user?.role, user?.companyId, page, limit, search],
    queryFn: () => (isSuperAdmin ? getPackages(page, limit, search) : getPackagesByCompany(user?.companyId || "", page, limit, search)),
    enabled: !!user,
  });
};
