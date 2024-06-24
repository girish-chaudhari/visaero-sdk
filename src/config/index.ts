import axiosConfig, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from "axios";
import { baseUrl } from "./baseUrl";

let pendingRequests: CancelTokenSource[] = [];

const instance = axiosConfig.create({
  baseURL: baseUrl,
  responseType: "json",
});

const onRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  //   console.info(`[request] [${JSON.stringify(config)}]`);
  const source = axiosConfig.CancelToken.source();
  pendingRequests.push(source);
  config.cancelToken = source.token;
  console.log("config >>", config)
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  //   console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  //   console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  //   console.error(`[response error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

export const cancelPendingRequests = () => {
  pendingRequests.forEach((cancelTokenSource) => {
    cancelTokenSource.cancel("Operation canceled by the user.");
  });
  pendingRequests = [];
};

export const axiosInstance = instance;

export const createCancelableRequest = (
  config: AxiosRequestConfig
): { request: Promise<any>; cancelTokenSource: CancelTokenSource } => {
  const cancelTokenSource = axiosConfig.CancelToken.source();
  const request = axiosConfig({
    ...config,
    cancelToken: cancelTokenSource.token,
  });
  return { request, cancelTokenSource };
};

const axios = setupInterceptorsTo(instance);

export const noConfig = axiosConfig.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  },
});

export default axios;
