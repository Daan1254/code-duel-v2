import Axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
// eslint-disable-next-line import/no-mutable-exports
export let AXIOS_INSTANCE: AxiosInstance;

const publicRoutes = ["/login", "/register", "/"];

export function setAxiosInstance(axiosInstance: AxiosInstance) {
  if (AXIOS_INSTANCE?.defaults?.baseURL === axiosInstance?.defaults?.baseURL) {
    return;
  }

  AXIOS_INSTANCE = axiosInstance;
  console.log("Axios instance set to", AXIOS_INSTANCE.defaults.baseURL);

  AXIOS_INSTANCE.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const currentPath = window.location.pathname;
        // Only redirect if not on a public route
        if (!publicRoutes.includes(currentPath)) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
}

setAxiosInstance(
  Axios.create({
    baseURL: "http://localhost:3000",
  })
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();

  try {
    const token = localStorage.getItem("token");

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
        const fixedError = error as any;
        const message = fixedError.response?.data?.message;

        if (message) {
          if (Array.isArray(message)) {
            fixedError.message = message.join(", ");
          } else {
            fixedError.message = message;
          }
        }
      }

      return Promise.reject(error);
    });
};

export interface ErrorType<Error> extends AxiosError<Error> {}
