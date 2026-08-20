import { Request, Response } from "express";
import { supabase } from "./../config/supabase";
import crypto from "crypto";

export const submitKyc = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;

    const { document_type } = req.body;

    const files = req.files as {
      document_front?: Express.Multer.File[];
      document_back?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
    };

    console.log(files);
    const front = files?.document_front?.[0];
    const back = files?.document_back?.[0];
    const selfie = files?.selfie?.[0];

    if (!document_type) {
      return res.status(400).json({
        status: false,
        message: "Document type is required",
      });
    }

    if (!front || !back || !selfie) {
      return res.status(400).json({
        status: false,
        message: "All KYC documents are required",
      });
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    const maxSize = 10 * 1024 * 1024;

    for (const file of [front, back, selfie]) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          status: false,
          message: `Invalid file type: ${file.originalname}`,
        });
      }

      if (file.size > maxSize) {
        return res.status(400).json({
          status: false,
          message: `${file.originalname} is larger than 10MB`,
        });
      }
    }

    // Check existing pending submission
    const { data: existing } = await supabase
      .from("kyc_submissions")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return res.status(409).json({
        status: false,
        message: "You already have a KYC submission under review.",
      });
    }

    const submissionId = crypto.randomUUID();

    const basePath = `${userId}/${submissionId}`;

    const frontPath = `${basePath}/document-front`;
    const backPath = `${basePath}/document-back`;
    const selfiePath = `${basePath}/selfie`;

    // Upload front
    const { error: frontError } = await supabase.storage
      .from("kyc-documents")
      .upload(frontPath, front.buffer, {
        contentType: front.mimetype,
        upsert: false,
      });

    if (frontError) {
      throw frontError;
    }

    // Upload back
    const { error: backError } = await supabase.storage
      .from("kyc-documents")
      .upload(backPath, back.buffer, {
        contentType: back.mimetype,
        upsert: false,
      });

    if (backError) {
      throw backError;
    }

    // Upload selfie
    const { error: selfieError } = await supabase.storage
      .from("kyc-documents")
      .upload(selfiePath, selfie.buffer, {
        contentType: selfie.mimetype,
        upsert: false,
      });

    if (selfieError) {
      throw selfieError;
    }

    // Create database record
    const { data: submission, error: submissionError } = await supabase
      .from("kyc_submissions")
      .insert({
        id: submissionId,
        user_id: userId,
        document_type,
        document_front_path: frontPath,
        document_back_path: backPath,
        selfie_path: selfiePath,
        status: "pending",
      })
      .select()
      .single();

    if (submissionError) {
      throw submissionError;
    }

    // Update user status
    const { error: userError } = await supabase
      .from("users")
      .update({
        kyc_status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (userError) {
      throw userError;
    }

    return res.status(201).json({
      status: true,
      message: "KYC submitted successfully",
      data: submission,
    });
  } catch (error) {
    console.error("KYC submission error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to submit KYC",
    });
  }
};
export const getMyKyc = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId;

        const { data, error } = await supabase
            .from("kyc_submissions")
            .select(`
                id,
                document_type,
                status,
                rejection_reason,
                created_at,
                reviewed_at
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Get KYC error:", error);

            return res.status(500).json({
                status: false,
                message: "Failed to get KYC status",
            });
        }

        return res.status(200).json({
            status: true,
            data,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            status: false,
            message: "Failed to get KYC status",
        });
    }
};