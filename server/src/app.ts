import express from "express";
import morgan from "morgan";
import authRoute from "./routes/auth.route";
import cors from "cors";

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

export default app;
