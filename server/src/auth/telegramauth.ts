import { NextFunction, Request, Response } from "express";
import { validateTelegramData } from "../utils/telegram";
import { env } from "../config/env";
import { supabase } from "../config/supabase";
import jwt from "jsonwebtoken";
import { catchAsync } from "../utils/cachAsync";
import { AppError } from "../utils/AppError";

export const telegramAuth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

        const { data: user, error } = await supabase
          .from("users")
          .select(
            `
            *,
            wallets (
              id,
              asset,
              balance,
              locked_balance,
              created_at
            )
            `,
          )
          .eq("id", payload.userId)
          .single();

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

        return next(new AppError("Authentication failed", 401));
      }
    }

    const { initData } = req.body;

    if (!initData) {
      return next(new AppError("initData is required", 400));
    }

    if (!env.bottoken) {
      return next(new AppError("Telegram bot token is not configured", 500));
    }

    let tgUser;

    try {
      tgUser = validateTelegramData(env.bottoken, initData);
    } catch (err) {
      return next(new AppError("Invalid Telegram data", 401));
    }

    if (!tgUser?.user?.id) {
      return next(new AppError("Telegram user not found", 401));
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert(
        {
          telegram_id: tgUser.user.id,
          username: tgUser.user.username ?? null,
          Fname: tgUser.user.first_name ?? null,
          Lname: tgUser.user.last_name ?? null,
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

    if (!env.jwtsecrete) {
      return next(new AppError("JWT secret is not configured", 500));
    }

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

    const { data: userdata, error: userdataError } = await supabase
      .from("users")
      .select(
        `
        *,
        wallets (
          id,
          asset,
          balance,
          locked_balance,
          created_at
        )
        `,
      )
      .eq("id", user.id)
      .single();

    if (userdataError || !userdata) {
      console.error("User fetch error:", userdataError);

      return next(new AppError("Failed to fetch user information", 500));
    }

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
    const { data } = await supabase
      .from("users")
      .select(
        `*,wallets (
        balance,
        locked_balance
      )`,
      )
      .eq("id", userId)
      .single();
    if (!data) {
      return next(new AppError("User not Found", 404));
    }
    res.json(data);
  },
);
