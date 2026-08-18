import apiClient from "./apiClient";

export const me = async () => {
  const res = await apiClient.get("/auth/me");
  return res.data;
};

export const sharePhone = async ({
  telegram_id,
  phone,
}: {
  telegram_id: number;
  phone: string;
}) => {
  const res = await apiClient.post("/auth/phone", {
    telegram_id,
    phone,
  });
  return res.data;
};
