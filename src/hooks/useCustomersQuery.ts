import { useQuery } from "@tanstack/react-query";
import { listCustomers, listCustomersByCompany, getCustomer } from "@/services/customers";
import type { Customer, CustomersListResponse } from "@/services/customers";

export const useCustomersQuery = (page: number = 1, limit: number = 20) => {
  return useQuery<CustomersListResponse>({
    queryKey: ["customers", page, limit],
    queryFn: () => listCustomers(page, limit),
    staleTime: 0,
    refetchOnMount: true,
  });
};

export const useCustomersByCompanyQuery = (companyId: string, page: number = 1, limit: number = 20, search?: string) => {
  return useQuery<CustomersListResponse>({
    queryKey: ["customers", companyId, page, limit, search],
    queryFn: () => listCustomersByCompany(companyId, page, limit, search),
    enabled: !!companyId,
    staleTime: 0,
    refetchOnMount: true,
  });
};

export const useCustomerQuery = (id: string) => {
  return useQuery<Customer>({
    queryKey: ["customers", id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
