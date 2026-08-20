import express from "express";
import { requireAuth } from "../middleware/auth";
import { submitKyc, getMyKyc } from "../controller/kyc.controller";
import { Upload } from "../middleware/upload";

const kycRoute = express.Router();

kycRoute.post(
    "/submit",
    requireAuth,
    Upload.fields([
        { name: "document_front", maxCount: 1 },
        { name: "document_back", maxCount: 1 },
        { name: "selfie", maxCount: 1 },
    ]),
    submitKyc
);
kycRoute.get("/status", requireAuth, getMyKyc)

export default kycRoute;