import { useGetProfile } from "@/api/endpoints/user/user";

export const useUser = () => {
  const { data: user } = useGetProfile();

  return { user };
};
