import type { Role } from "@/contexts/auth";

export type RoutePermission = {
  path: string;
  allowedRoles: Role[];
};

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  {
    path: "/",
    allowedRoles: ["super_admin", "admin", "attendant"],
  },
  {
    path: "/enterprises",
    allowedRoles: ["super_admin"],
  },
  {
    path: "/registrations",
    allowedRoles: ["admin"],
  },
  {
    path: "/registrations/customers",
    allowedRoles: ["admin", "attendant"],
  },
  {
    path: "/registrations/travelers",
    allowedRoles: ["admin"],
  },
  {
    path: "/registrations/buses",
    allowedRoles: ["admin"],
  },
  {
    path: "/registrations/hotels",
    allowedRoles: ["admin"],
  },
  {
    path: "/packages-trips",
    allowedRoles: ["admin"],
  },
  {
    path: "/pos",
    allowedRoles: ["admin", "attendant"],
  },
  {
    path: "/financial",
    allowedRoles: ["admin"],
  },
  {
    path: "/financial/payables",
    allowedRoles: ["admin"],
  },
  {
    path: "/financial/receivables",
    allowedRoles: ["admin"],
  },
  {
    path: "/financial/cash-control",
    allowedRoles: ["admin"],
  },
  {
    path: "/settings",
    allowedRoles: ["super_admin", "admin"],
  },
];

export const ROLE_DISPLAY_NAMES: Record<Role, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  attendant: "Attendant",
};
