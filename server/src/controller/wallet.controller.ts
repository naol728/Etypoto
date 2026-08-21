import { supabase } from "../config/supabase";
import { Request, Response } from "express";
import { catchAsync } from "../utils/cachAsync";
export const getMyBalance = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const { data: wallets, error } = await supabase
    .from("wallets")
    .select(
      `
        id,
        asset,
        available_balance,
        locked_balance,
        created_at,
        updated_at
      `,
    )
    .eq("user_id", userId)
    .order("asset");

  if (error) {
    console.error("Wallet error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to get wallet",
    });
  }

  return res.status(200).json({
    status: true,
    wallets: wallets ?? [],
  });
});
