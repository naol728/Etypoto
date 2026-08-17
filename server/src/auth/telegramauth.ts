import { NextFunction, Request, Response } from "express";
import { validateTelegramData } from "../utils/telegram";
import { env } from "../config/env";
import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/cachAsync";
import { AppError } from "../utils/AppError";

export const telegramAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // =====================================================
    // Helper: Get user with wallets
    // =====================================================

    const getUserWithWallets = async (userId: string) => {
      return await supabase
        .from("users")
        .select(
          `
          *,
          wallets (
            id,
            asset,
            available_balance,
            locked_balance,
            created_at,
            updated_at
          )
        `,
        )
        .eq("id", userId)
        .single();
    };

    // =====================================================
    // 1. JWT Authentication
    // =====================================================

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        if (!env.jwtsecrete) {
          return next(new AppError("JWT secret is not configured", 500));
        }

        const payload = jwt.verify(token, env.jwtsecrete) as {
          userId: string;
          telegramId: number;
        };

        const { data: user, error } = await getUserWithWallets(payload.userId);

        if (error || !user) {
          return next(new AppError("User not found", 401));
        }

        return res.status(200).json({
          status: true,
          access_token: token,
          user,
        });
      } catch (err: any) {
        if (err.name === "TokenExpiredError") {
          return next(new AppError("Token expired", 401));
        }

        if (err.name === "JsonWebTokenError") {
          return next(new AppError("Invalid token", 401));
        }

        console.error("JWT authentication error:", err);

        return next(new AppError("Authentication failed", 401));
      }
    }

    // =====================================================
    // 2. Telegram Authentication
    // =====================================================

    const { initData } = req.body;

    if (!initData) {
      return next(new AppError("initData is required", 400));
    }

    if (!env.bottoken) {
      return next(new AppError("Telegram bot token is not configured", 500));
    }

    // =====================================================
    // 3. Validate Telegram initData
    // =====================================================

    let tgUser;

    try {
      tgUser = validateTelegramData(env.bottoken, initData);
    } catch (err) {
      console.error("Telegram validation error:", err);

      return next(new AppError("Invalid Telegram data", 401));
    }

    if (!tgUser?.user?.id) {
      return next(new AppError("Telegram user not found", 401));
    }

    // =====================================================
    // 4. Create / Fetch User
    // =====================================================

    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          telegram_id: tgUser.user.id,
          telegram_username: tgUser.user.username ?? null,
          telegram_first_name: tgUser.user.first_name ?? null,
          telegram_last_name: tgUser.user.last_name ?? null,
        },
        {
          onConflict: "telegram_id",
        },
      )
      .select()
      .single();

    if (userError || !user) {
      console.error("User upsert error:", userError);

      return next(new AppError("Failed to create or fetch user", 500));
    }

    // =====================================================
    // 5. JWT Secret
    // =====================================================

    if (!env.jwtsecrete) {
      return next(new AppError("JWT secret is not configured", 500));
    }

    // =====================================================
    // 6. Create JWT
    // =====================================================

    const token = jwt.sign(
      {
        userId: user.id,
        telegramId: user.telegram_id,
      },
      env.jwtsecrete,
      {
        expiresIn: "7d",
      },
    );

    // =====================================================
    // 7. Fetch User + Wallets
    // =====================================================

    const { data: userdata, error: userdataError } = await getUserWithWallets(
      user.id,
    );

    if (userdataError || !userdata) {
      console.error("User fetch error:", userdataError);

      return next(new AppError("Failed to fetch user information", 500));
    }

    // =====================================================
    // 8. Response
    // =====================================================

    return res.status(200).json({
      status: true,
      access_token: token,
      user: userdata,
    });
  },
);

interface AuthRequest extends Request {
  user: {
    userId: string;
    telegramId: number;
  };
}

export const me = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        wallets (
          id,
          asset,
          available_balance,
          locked_balance,
          created_at,
          updated_at
        )
      `,
      )
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Get current user error:", error);

      return next(new AppError("Failed to fetch user", 500));
    }

    if (!data) {
      return next(new AppError("User not found", 404));
    }

    return res.status(200).json({
      status: true,
      user: data,
    });
  },
);
