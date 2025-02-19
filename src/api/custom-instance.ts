import Axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { getCookie } from "typescript-cookie";
  // eslint-disable-next-line import/no-mutable-exports
  export let AXIOS_INSTANCE: AxiosInstance;
  
  export function setAxiosInstance(axiosInstance: AxiosInstance) {
    if (AXIOS_INSTANCE?.defaults?.baseURL === axiosInstance?.defaults?.baseURL) {
      return;
    }
  
    AXIOS_INSTANCE = axiosInstance;
    console.log("Axios instance set to", AXIOS_INSTANCE.defaults.baseURL);
  }
  
  setAxiosInstance(
    Axios.create({
      baseURL: "http://localhost:3000",
    })
  );
  
  export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
  
    try {
      const token = getCookie("token");
  
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
  
      
    } catch (e) {
      console.error("Error getting token", e);
    }
  
    return AXIOS_INSTANCE({ ...config, cancelToken: source.token })
      .then(({ data }) => data)
      .catch((error: AxiosError) => {
        if (Axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          // @ts-ignore
          const message = error.response?.data?.message;
  
          if (message) {
            if (Array.isArray(message)) {
              // @ts-ignore
              error.message = message.join(", ");
            } else {
              // @ts-ignore
              error.message = message;
            }
          }
        }
  
        return Promise.reject(error);
      });
  };
  
  export interface ErrorType<Error> extends AxiosError<Error> {}