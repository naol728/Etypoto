import express from "express";
import morgan from "morgan";
import authRoute from "./routes/auth.route";
import cors from "cors";
import kycRoute from "./routes/kyc.route";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRoute);
app.use("/api/kyc", kycRoute);

export default app;
