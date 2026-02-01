import { useQuery } from "@tanstack/react-query";
import { getPackageTrips, getPackageTripsByCompany } from "@/services/packageTrips";
import { useAuth } from "./useAuth";

export const usePackageTripsQuery = (page: number = 1, limit: number = 20, search?: string) => {
  const { user } = useAuth();

  const isSuperAdmin = user?.role === "super_admin";

  return useQuery({
    queryKey: ["packageTrips", user?.role, user?.companyId, page, limit, search],
    queryFn: () => (isSuperAdmin ? getPackageTrips(page, limit, search) : getPackageTripsByCompany(user?.companyId || "", page, limit, search)),
    enabled: !!user,
  });
};
