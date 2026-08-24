import apiClient from "./apiClient";

export const getMybalance = async () => {
  const { data } = await apiClient.get("/wallet/balance");
  return data;
};

export interface CreateUsdtDepositRequest {
  amount: number;
  network: "TRC20" | "ERC20" | "BEP20";
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
  const response = await apiClient.post<CreateUsdtDepositResponse>(
    "/wallet/deposit/usdt",
    data,
  );

  return response.data;
};

export const getDeposit = async () => {
  const response = await apiClient.get("/wallet/deposit");
  return response.data;
};
