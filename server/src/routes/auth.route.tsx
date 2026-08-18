import express from "express";
import { me, telegramAuth, updateTelegramPhone } from "../auth/telegramauth";
const authRoute = express.Router()
authRoute.post("/telegram", telegramAuth)
authRoute.post("/phone", updateTelegramPhone)
authRoute.post("/me", me)
export default authRoute