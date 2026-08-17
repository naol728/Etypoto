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
  balance: number;
  locked_balance: number;
  created_at: string;
}

export interface User {
  id: string;
  telegram_id: number;
  username: string | null;
  created_at: string;
  updated_at: string;
  Fname: string | null;
  Lname: string | null;
  referral_id: string | null;
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
      console.log("🔥 initAuth started");

      const telegram = (window as any).Telegram;

      console.log("Telegram object:", telegram);

      const initData = telegram?.WebApp?.initData;

      console.log("Telegram initData:", initData);

      if (!initData) {
        throw new Error("Telegram initData not found");
      }

      console.log("🚀 Sending request to backend...");

      const res = await apiClient.post("/auth/telegram", {
        initData,
      });

      console.log("✅ Backend response:", res.data);

      const data = res.data;

      if (!data?.access_token || !data?.user) {
        throw new Error("Authentication failed");
      }

      localStorage.setItem("access_token", data.access_token);

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
        balance: number;
        locked_balance: number;
      }>,
    ) => {
      if (!state.user) return;

      const wallet = state.user.wallets.find(
        (wallet) => wallet.asset === action.payload.asset,
      );

      if (wallet) {
        wallet.balance = action.payload.balance;
        wallet.locked_balance = action.payload.locked_balance;
      }
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.loading = false;

      localStorage.removeItem("access_token");
    },
  },

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

export const { setUserWallet, setUser, logout } = authSlice.actions;

export default authSlice.reducer;
