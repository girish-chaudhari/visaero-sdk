
import axios, { noConfig } from "@/config/";
import * as API from "./api";
import { baseUrl } from "@/config/baseUrl";
import { AxiosResponse } from "axios";
import { enterpriseObj } from "@/types";

const host = "visaero";
let user_id = "some";

export const getEnterpriseAccount = ({
  queryKey,
  signal,
}: {
  signal: any;
  queryKey: [string, string];
}) => {
  const [_, domain_host] = queryKey;
  console.log("baseUrl on server", baseUrl);
  return axios.get<AxiosResponse<enterpriseObj>>(
    API.getEnterpriseAccountHostDetails,
    {
      signal,
      params: {
        domain_host,
      },
    }
  );
};

export const getNewsAndUpdates = ({}) => {
  return axios.post(API.getNewsAndUpdates, {
    user_id,
  });
};
export const getNotifications = ({ signal }: { signal: any }) => {
  return axios.get(API.getNotification, {
    signal,
    params: {
      host,
      user_id,
    },
  });
};

export const getDashboardData = ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [_, dates] = queryKey;

  const start_date = dates[0];
  const end_date = dates[1];

  return axios.post(API.getNewDashboard, {
    host,
    user_id,
    start_date,
    end_date,
  });
};

export const verifySession = async ({ signal }: { signal: any }) => {
  let session_id = "some";
  //   user_id = localStorage.getItem("user_id");
  return axios.post(
    API.verifyAdminUserSession,
    {
      session_id,
      user_id,
    },
    {
      signal,
    }
  );
};

export const loginService = async (data: any) => {
  return noConfig.post(API.login, data);
};
export const forgotPassword = async (data: any) => {
  return noConfig.post(API.forgotPassword, data);
};

export const ipApi = async (data: any) => {
  return fetch(API.ipApi).then((res) => res.json());
};

export const getNationalities = async ({ signal }: { signal: any }) => {
  return axios.get(API.getNationalities, {
    signal,
    params: {
      host,
    },
  });
};
export const getOrigin = async ({ signal }: { signal: any }) => {
  return axios.get(API.getOrigin, {
    signal,
    params: {
      host,
    },
  });
};
export const getSupportedCurrencies = async ({ signal }: { signal: any }) => {
  return axios.get(API.getSupportedCurrencies, {
    signal,
    params: {
      host,
    },
  });
};
export const getTravellingTo = async ({
  queryKey,
}: {
  queryKey: [string, { nationality: string; origin: string }];
}) => {
  const [_, obj] = queryKey;
  const { nationality, origin } = obj;
  // console.log("session_id", session_id);
  return axios.post(API.getTravellingto, {
    host,
    nationality,
    origin: nationality,
    user_id,
  });
};
export const getVisaOffers = async (data: any) => {
  // console.log(data)
  return axios.post(API.getVisaOffers, {
    ...data,
    host,
    user_id,
  });
};

const services = {
  getEnterpriseAccount,
  getNewsAndUpdates,
  getNotifications,
  getDashboardData,
  verifySession,
  loginService,
  forgotPassword,
  ipApi,
  getNationalities,
  getOrigin,
  getSupportedCurrencies,
  getTravellingTo,
  getVisaOffers,
};

export default services;
