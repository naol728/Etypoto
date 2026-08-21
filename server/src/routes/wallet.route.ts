import express from "express";
import { requireAuth } from "../middleware/auth";
import {
  createDeposit,
  getMyBalance,
  nowPaymentsWebhook,
} from "../controller/wallet.controller";

const walletRoute = express.Router();

walletRoute.get("/balance", requireAuth, getMyBalance);
walletRoute.post("/webhooks/nowpayments", nowPaymentsWebhook);
walletRoute.post("/deposit/usdt", requireAuth, createDeposit);

export default walletRoute;
