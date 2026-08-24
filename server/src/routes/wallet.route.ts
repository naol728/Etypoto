import express from "express";
import { requireAuth } from "../middleware/auth";
import {
  createDeposit,
  getMyBalance,
  nowPaymentsWebhook,
  getDeposit
} from "../controller/wallet.controller";

const walletRoute = express.Router();

walletRoute.get("/balance", requireAuth, getMyBalance);
walletRoute.post("/webhooks/nowpayments", nowPaymentsWebhook);
walletRoute.get("/deposit", getDeposit);
walletRoute.post("/deposit/usdt", requireAuth, createDeposit);

export default walletRoute;
