import { useMutation } from "@tanstack/react-query";
import { login as apiLogin } from "@/services/auth";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await apiLogin(credentials);
    },
  });
};
