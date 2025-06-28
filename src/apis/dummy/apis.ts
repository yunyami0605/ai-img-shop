import { GetHomeDummyDataResponse } from "@/types/apis/dummy/response";
import { apiCall } from "../common";
import { GetChartDummyDataItem } from "@/types/apis/dummy";

/**
 *@description 홈 이미지 더미 데이터
 */
export const getHomeDummyData = () => {
  return apiCall<GetHomeDummyDataResponse>({
    url: "/test/image",
    method: "GET",
  });
};

export const getChartDummyData = () => {
  return apiCall<GetChartDummyDataItem[]>({
    url: "/test/chart",
  });
};
