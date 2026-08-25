import { handleApiResponse } from "@/lib/handleapiresponse";
import apiClient from "./apiClient";

export const getMybalance = async () => {
  const { data } = await apiClient.get("/wallet/balance");
  return data;
};

export interface CreateUsdtDepositRequest {
  amount: number;
  network: string;
}

export interface CreateUsdtDepositResponse {
  status: boolean;
  transaction_id: string;
  payment: {
    payment_id: number | string;
    address: string;
    amount: number;
    currency: string;
    status: string;
    expiration?: string;
  };
}

export const depositWallet = async (
  data: CreateUsdtDepositRequest,
): Promise<CreateUsdtDepositResponse> => {
  return handleApiResponse(() =>
    apiClient.post<CreateUsdtDepositResponse>("/wallet/deposit/usdt", data),
  );
};

export const getDeposit = async () => {
  return handleApiResponse(() => apiClient.get("/wallet/deposit"));
};
