import services from "@/services";
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from "@tanstack/react-query";
import { headers } from "next/headers";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const ThemeProvider = async (props: Props) => {
  const { children } = props;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["enterprise-account", "cp-vi-stage.visaero.com"],
    queryFn: services.getEnterpriseAccount,
  });

  const headersList = headers();

  let host = headersList.get("host");
  console.log("working", host);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
};

export default ThemeProvider;
