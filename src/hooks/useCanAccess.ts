import { useAuth } from "./useAuth";
import type { Role } from "@/contexts/auth";

export const useCanAccess = (requiredRoles?: Role[]): boolean => {
  const { role } = useAuth();

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.includes(role as Role);
};
