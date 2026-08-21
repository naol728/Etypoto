import apiClient from "./apiClient";

export const getMybalance = async () => {
  const { data } = await apiClient.get("/wallet/balance");
  return data;
};
