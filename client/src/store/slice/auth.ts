/* eslint-disable */

import apiClient from "./../../api/apiClient";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface Wallet {
  id: string;
  asset: "ETB" | "USDT";
  available_balance: number;
  locked_balance: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;

  telegram_id: number;

  telegram_username: string | null;
  telegram_first_name: string | null;
  telegram_last_name: string | null;

  phone: string | null;

  kyc_status: "pending" | "verified" | "rejected";

  veritas_user_id: string | null;
  kyc_verified_at: string | null;

  status: "active" | "suspended" | "blocked";

  referral_code: string | null;
  referred_by: string | null;

  created_at: string;
  updated_at: string;

  wallets: Wallet[];
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: true,
};

export const initAuth = createAsyncThunk(
  "auth/init",

  async (_, { rejectWithValue }) => {
    try {
      const telegram = (window as any).Telegram;

      const webApp = telegram?.WebApp;

      // if (!webApp) {
      //   throw new Error("Please open this application inside Telegram.");
      // }

      webApp.ready();
      webApp.expand();

      const initData = webApp.initData;

      // if (!initData) {
      //   throw new Error("Telegram authentication data not found.");
      // }

      const res = await apiClient.post("/auth/telegram", {
        initData,
      });

      const data = res.data;

      if (!data?.access_token || !data?.user) {
        throw new Error("Authentication failed");
      }

      localStorage.setItem("access_token", data.access_token);

      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("✅ Telegram authentication successful");

      return data.user as User;
    } catch (error: any) {
      console.error("❌ Auth error:", error);

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Authentication failed",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setUserWallet: (
      state,
      action: PayloadAction<{
        asset: "ETB" | "USDT";
        available_balance: number;
        locked_balance: number;
      }>,
    ) => {
      if (!state.user) return;

      const wallet = state.user.wallets.find(
        (wallet) => wallet.asset === action.payload.asset,
      );

      if (wallet) {
        wallet.available_balance = action.payload.available_balance;

        wallet.locked_balance = action.payload.locked_balance;
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    setUserPhone: (state, action: PayloadAction<string>) => {
      if (!state.user) return;

      state.user.phone = action.payload;

      localStorage.setItem("user", JSON.stringify(state.user));
    },

    logout: (state) => {
      state.user = null;
      state.loading = false;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },

  // =================================================
  // Async Actions
  // =================================================

  extraReducers: (builder) => {
    builder

      .addCase(initAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })

      .addCase(initAuth.rejected, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { setUserWallet, setUser, setUserPhone, logout } =
  authSlice.actions;

export default authSlice.reducer;
