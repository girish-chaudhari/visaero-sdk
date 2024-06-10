"use server";

import axios from "@/config";
import API from "@/services/api";
import { IPData, VisaOfferProps } from "@/types";
import { AxiosProgressEvent, CancelToken, CancelTokenSource } from "axios";
import { revalidatePath } from "next/cache";

const host = "visaero";
const user_id = "6661e183111e64be598b4aa1";

// Define types and interfaces
interface Country {
  name: string;
  cioc: string;
  callingCodes: string;
  flag: string;
  synonyms: string[];
}

interface NationalityResponse {
  data: string; // This should be a string indicating status, not the response data
  dataobj:
    | {
        data: Country[]; // Update to allow empty array value for dataobj.data
      }
    | any;
}

// Function to fetch IP data
export const getIpData = async (): Promise<IPData | null> => {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

// Function to get nationalities
export const getNationalities = async (): Promise<Country[] | []> => {
  try {
    const response = await axios.get<NationalityResponse>(
      API.getNationalities,
      {
        params: {
          domain_host: "cp-vi-stage.visaero.com",
        },
      }
    );
    const { data: status, dataobj: countries } = response.data;
    revalidatePath("/evm/new-visa");
    if (status === "success" && countries?.data && countries.data.length > 0) {
      return countries.data ?? [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching nationality data:", error);
    return [];
  }
};

export const getTravellingTo = async (obj: {
  nationality: string;
  origin: string;
}) => {
  console.log("works", obj, host);
  const { nationality = "", origin = "" } = obj;

  let request = await axios.post(API.getTravellingto, {
    host,
    nationality,
    origin,
    user_id,
  });
  revalidatePath("/evm/new-visa");
  console.log("request from server>>", request.data);
  return request.data;
};

interface GetVisaOffers {
  type: "qr-visa";
  travelling_to_identity: string;
  travelling_to: string;
  nationality: string;
  // host: string;
  currency: string;
  // user_id: string;
  managed_by: "master" | "host";
}

interface GetVisaOfferProps {
  dataobj: VisaOfferProps[];
  data: string;
}

export const getVisaOffers = async (
  obj: GetVisaOffers
): Promise<GetVisaOfferProps> => {
  console.log("works", obj, host);
  let payload = { ...obj, host, user_id };
  let request = await axios.post(API.getVisaOffers, payload);
  console.log("request from server>>", request.data);
  revalidatePath("/evm/new-visa");
  return request.data;
};

export const getSupportedCurrencies = async () => {
  console.log("works", host);
  let request = await axios.get(API.getSupportedCurrencies, {
    params: { host },
  });
  console.log("request from server>>", request.data);
  return request.data;
};

export const uploadAndExtractDocumentsAction = async (formData: FormData) => {
  console.log("file upload", formData);
  // const { cancelToken,  } = options;
  // const { cancelToken, onUploadProgress } = options;
  let request = await axios.post(API.uploadAndExtractDocuments, formData, {
    // onUploadProgress,
    // onUploadProgress: ProgressEvent,
    // cancelToken: options.cancelToken.token,
    // ...payload,
  });
  console.log("request from server>>", request.data);
  return request.data;
};
