import { supabase } from "../config/supabase";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/cachAsync";
import crypto from "crypto";
export const getMyBalance = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const { data: wallets, error } = await supabase
    .from("wallets")
    .select(
      `
        id,
        asset,
        available_balance,
        locked_balance,
        created_at,
        updated_at
      `,
    )
    .eq("user_id", userId)
    .order("asset");

  if (error) {
    console.error("Wallet error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to get wallet",
    });
  }

  return res.status(200).json({
    status: true,
    wallets: wallets ?? [],
  });
});
export const depositCrypto = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
  },
);
export const createDeposit = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const { amount, network } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({
      status: false,
      message: "Invalid deposit amount",
    });
  }

  if (!network) {
    return res.status(400).json({
      status: false,
      message: "Network is required",
    });
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("transactions")
    .insert({
      user_id: userId,
      type: "deposit",
      asset: "USDT",
      amount: Number(amount),
      status: "pending",
      provider: "nowpayments",
      network,
    })
    .select()
    .single();

  if (transactionError || !transaction) {
    console.error(transactionError);

    return res.status(500).json({
      status: false,
      message: "Failed to create transaction",
    });
  }

  const response = await fetch("https://api.nowpayments.io/v1/payment", {
    method: "POST",

    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      price_amount: Number(amount),
      price_currency: "usd",

      // Change this to the exact NOWPayments
      // currency code for the network you support.
      pay_currency: "usdttrc20",

      order_id: transaction.id,

      order_description: `EtyPoto USDT deposit ${transaction.id}`,

      ipn_callback_url: process.env.NOWPAYMENTS_IPN_URL,
    }),
  });

  const payment = await response.json();

  if (!response.ok || !payment.payment_id) {
    console.error("NOWPayments error:", payment);

    await supabase
      .from("transactions")
      .update({
        status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", transaction.id);

    return res.status(500).json({
      status: false,
      message: "Failed to create NOWPayments payment",
    });
  }

  // Save NOWPayments information
  const { error: updateError } = await supabase
    .from("transactions")
    .update({
      provider_transaction_id: String(payment.payment_id),

      address: payment.pay_address ?? null,

      network,

      updated_at: new Date().toISOString(),
    })
    .eq("id", transaction.id);

  if (updateError) {
    console.error(updateError);
  }

  return res.status(201).json({
    status: true,

    transaction_id: transaction.id,

    payment: {
      payment_id: payment.payment_id,

      address: payment.pay_address,

      amount: payment.pay_amount,

      currency: payment.pay_currency,

      status: payment.payment_status,

      expiration: payment.expiration_estimate_date,
    },
  });
});
function sortObject(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj)
    .sort()
    .reduce((result: Record<string, any>, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

export const nowPaymentsWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers["x-nowpayments-sig"];

    if (!signature) {
      return res.status(401).json({
        status: false,
        message: "Missing signature",
      });
    }

    const secret = process.env.NOWPAYMENTS_IPN_SECRET!;

    /*
     * IMPORTANT:
     * Use the raw request body for signature
     * verification in your Express configuration.
     *
     * The exact serialization must match
     * NOWPayments' IPN documentation.
     */

    const payload = req.body;

    const sortedPayload = JSON.stringify(sortObject(payload));

    const expectedSignature = crypto
      .createHmac("sha512", secret)
      .update(sortedPayload)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.warn("Invalid NOWPayments signature");

      return res.status(401).json({
        status: false,
        message: "Invalid signature",
      });
    }

    const {
      payment_id,
      payment_status,
      pay_amount,
      pay_currency,
      actually_paid,
      outcome_amount,
      outcome_currency,
      order_id,
      pay_address,
      purchase_id,
    } = payload;

    if (!payment_id || !order_id) {
      return res.status(400).json({
        status: false,
        message: "Invalid payment data",
      });
    }

    /*
     * Find our transaction using order_id.
     */
    const { data: transaction, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", order_id)
      .single();

    if (error || !transaction) {
      console.error("Transaction not found:", order_id);

      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    /*
     * Idempotency:
     * If already completed, don't credit again.
     */
    if (transaction.status === "completed") {
      return res.status(200).json({
        status: true,
        message: "Already processed",
      });
    }

    /*
     * Update status.
     */
    let newStatus = transaction.status;

    switch (payment_status) {
      case "waiting":
        newStatus = "pending";
        break;

      case "confirming":
        newStatus = "confirming";
        break;

      case "confirmed":
      case "sending":
        newStatus = "processing";
        break;

      case "finished":
        newStatus = "completed";
        break;

      case "failed":
      case "expired":
      case "refunded":
        newStatus = payment_status;
        break;

      case "partially_paid":
        newStatus = "pending";
        break;
    }

    /*
     * Only credit wallet when payment is finished.
     */
    if (payment_status === "finished") {
      const depositAmount = Number(actually_paid ?? pay_amount);

      const { error } = await supabase.rpc("complete_usdt_deposit", {
        p_transaction_id: transaction.id,
        p_amount: depositAmount,
        p_tx_hash: payload.payin_hash ?? null,
      });

      if (error) {
        console.error("Deposit RPC error:", error);

        return res.status(500).json({
          status: false,
          message: "Failed to complete deposit",
        });
      }
    }

    await supabase
      .from("transactions")
      .update({
        status: newStatus,

        tx_hash: payload.payin_hash ?? null,

        address: pay_address ?? transaction.address,

        provider_transaction_id: String(payment_id),

        updated_at: new Date().toISOString(),
      })
      .eq("id", transaction.id);

    return res.status(200).json({
      status: true,
    });
  } catch (error) {
    console.error("NOWPayments webhook error:", error);

    return res.status(500).json({
      status: false,
      message: "Webhook processing failed",
    });
  }
};
