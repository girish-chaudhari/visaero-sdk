"use server";

import axios from "@/config";
import defaultAxios from "axios";
import API from "@/services/api";
import { EnterpriseData } from "@/types";
import { headers } from "next/headers";

interface EnterpriseDataResponse {
  data: string;
  dataobj: EnterpriseData;
}

export const getEnterpriseData = async (): Promise<EnterpriseData> => {
  try {
    const headersList = headers();

    let host = headersList.get("host"); // to get domain
    console.log("header", host);

    let domain_host: string | null = host?.includes("localhost")
      ? "cp.visaero.com"
      : host;

    const { data }: { data: EnterpriseDataResponse } = await axios.get(
      API.getEnterpriseAccountHostDetails,
      {
        params: {
          domain_host,
        },
      }
    );

    if (data.data === "success") {
      console.log("Enterprise data:", data);
      return data.dataobj;
    } else {
      throw new Error("Failed to fetch enterprise data: Status not successful");
    }
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to fetch enterprise data");
  }
};

export const getIpDetails = async (): Promise<any> => {
  try {
    const { data }: { data: any } = await defaultAxios.get(API.ipApi);
    if (data) {
      console.log("IpData:", data);
      return data;
    } else {
      throw new Error("Failed to fetch enterprise data: Status not successful");
    }
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to fetch enterprise data");
  }
};
