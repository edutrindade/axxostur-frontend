import { api } from "./api";
import type { CreateUserFormData, UpdateUserFormData, UsersListResponse } from "@/types/user";

export interface CreateUserRequest extends CreateUserFormData {
  companyId?: string;
}

export interface UpdateUserRequest extends UpdateUserFormData {
  companyId?: string | null;
}

export const getUsersList = async (page: number = 1, limit: number = 20, search: string = ""): Promise<UsersListResponse> => {
  const { data } = await api.get("/users", {
    params: {
      page,
      limit,
      search,
    },
  });
  return data;
};

export const createUser = async (user: CreateUserRequest): Promise<any> => {
  const { data } = await api.post("/users", user);
  return data;
};

export const updateUser = async (id: string, user: UpdateUserRequest): Promise<any> => {
  const { data } = await api.put(`/users/${id}`, user);
  return data;
};

export const deleteUser = async (id: string): Promise<any> => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};
