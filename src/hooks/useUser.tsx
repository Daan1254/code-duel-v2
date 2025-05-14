import { useGetMe } from "@/api/endpoints/user/user";

export const useUser = () => {
  const { data: user } = useGetMe();

  return { user };
};
