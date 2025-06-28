import { useQuery } from "@tanstack/react-query";
import { getChartDummyData, getHomeDummyData } from "./apis";

/**
 *@description 홈 이미지 더미 데이터
 */
export const useGetHomeDummyData = () => {
  return useQuery({
    queryKey: ["get home dummy data"],
    queryFn: () => getHomeDummyData(),
  });
};

export const useGetChartDummyData = () => {
  return useQuery({
    queryKey: ["get chart dummy data"],
    queryFn: () => getChartDummyData(),
  });
};
