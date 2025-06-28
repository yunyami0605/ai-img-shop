import { PostLoginResponse } from "@/types/apis/auth/response";
import axios, {
  AxiosError,
  AxiosResponse,
  type AxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import _ from "lodash";

const BASE_URL = "http://localhost:3000/api";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

// NestJS 에러 응답 타입 정의
interface NestJSErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  path?: string;
  data?: object;
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<NestJSErrorResponse>) => {
    const errorResponse = error.response;

    if (errorResponse?.data) {
      const refreshToken = "";

      if (
        errorResponse.data.statusCode === 401 &&
        errorResponse.data.message === "Unauthorized" &&
        refreshToken
      ) {
        try {
          const responseRefreshAuth = (await axiosInstance({
            method: "POST",
            url: `auth/refresh`,
            headers: {
              Accept: "application/json",
            },
            data: {
              refreshToken,
            },
          })) as {
            data: PostLoginResponse;
          };

          if (error.config) {
            // AxiosHeaders를 사용하여 헤더 설정
            const headers = new AxiosHeaders();
            headers.set("Content-Type", "application/json");
            headers.set(
              "Authorization",
              `Bearer ${responseRefreshAuth.data.access}`
            );

            error.config.headers = headers;
            const response = await axios.request(error.config);
            return response;
          }
        } catch (refreshError) {
          // refresh token도 만료된 경우 처리
          console.error("Refresh token failed:", refreshError);
        }
      }

      if (
        errorResponse.data.statusCode === 500 &&
        errorResponse.data.message === "Unauthorized" &&
        refreshToken
      ) {
        // 로그인 상태이지만, refreshToken 및 accessToken 만료
        // 이전 버전 패치 후, TODO: 추후 작업
      }
    }

    return Promise.reject(error);
  }
);

/**
 *@description api 공통 호출 모듈
 *@param props - axios 라이브러리 props (url, method, headers, baseURL ...)
 */
export const apiCall = async <ResponseType = unknown>(
  props: AxiosRequestConfig
) => {
  const accessToken = "";

  //   if (__DEV__) {
  //     console.log("@ 2. METHOD");
  //     console.log(props.method);

  //     console.log("@ 1. URL");
  //     console.log(props.url);

  //     console.log("@ 2. DATA");
  //     console.log(props.data);
  //   }

  return axiosInstance({
    ...props,
    headers: {
      Accept: "application/json",
      ...props.headers,
      Authorization: "Bearer " + `${accessToken}`,
    },
    url: `${props.url}`,
  })
    .then(({ data, status }: { data: ResponseType; status: number }) => {
      return {
        data,
        statusCode: status,
      };
    })
    .catch((error: AxiosError<NestJSErrorResponse>) => {
      if (error.response?.data) {
        const data = error.response.data;

        console.log("@ API ERROR RESPONSE @");
        console.log(data);

        throw {
          data: data?.data,
          message: _.isString(data.message)
            ? data.message
            : _.isArray(data.message)
            ? data.message[0]
            : data.message,
          statusCode: error.response?.status || 500,
        };
      } else {
        throw {
          message: error?.message ?? "",
          statusCode: error.response?.status || 500,
        };
      }
    });
};
