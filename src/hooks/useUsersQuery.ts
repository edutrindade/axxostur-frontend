import { useQuery } from "@tanstack/react-query";
import { getUsersList } from "@/services/users";

export const useUsersListQuery = (page: number = 1, limit: number = 20, search: string = "") => {
  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => getUsersList(page, limit, search),
  });
};
