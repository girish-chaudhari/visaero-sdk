import { useQuery } from "@tanstack/react-query";
import { getEnterpriseAccount, ipApi, verifySession } from ".";

export const useEnterpriseAccount = (domain_host: string) => {
  return useQuery({
    queryKey: ["enterprise-account", domain_host],
    queryFn: getEnterpriseAccount,
  });
};

export const useGloblePermission = (data: { data: any; }) => {
  return useQuery({
    enabled: !!data?.data && data?.data === "success",
    queryKey: ["permissions"],
    refetchOnWindowFocus: 'always',
    queryFn: verifySession,
  });
};

export const useLocalDetails = (data: any) => {
  // console.log("data", data);
  return useQuery({
    // enabled: !!data?.data && data?.data === "success",
    queryKey: ["local-details"],
    // staleTime: 1000,
    queryFn: ipApi,
  });
};