import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, type UserProfile, type UpdateProfileRequest } from "@/services/profile";

export const useProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
