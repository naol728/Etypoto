import express from "express";
import { requireAuth } from "../middleware/auth";
import { getMyBalance } from "../controller/wallet.controller";

const walletRoute = express.Router();

walletRoute.get("/balance", requireAuth, getMyBalance);

export default walletRoute;
