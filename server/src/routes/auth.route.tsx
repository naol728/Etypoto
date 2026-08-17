import express from "express";
import { me, telegramAuth } from "../auth/telegramauth";
const authRoute = express.Router()
authRoute.post("/telegram", telegramAuth)
authRoute.post("/me", me)
export default authRoute