import { useState } from "react";
import {
  ArrowDownToLine,
  Building2,
  Check,
  Copy,
  Loader2,
  Smartphone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentAccount {
  id: string;
  name: string;
  type: "bank" | "mobile";
  accountName: string;
  accountNumber: string;
}

const paymentAccounts: PaymentAccount[] = [
  {
    id: "cbe",
    name: "CBE",
    type: "bank",
    accountName: "EtyPoto",
    accountNumber: "1000424161075",
  },
  {
    id: "telebirr",
    name: "Telebirr",
    type: "mobile",
    accountName: "EtyPoto",
    accountNumber: "0953922525",
  },
];

export default function EtbDeposit() {
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("cbe");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const account = paymentAccounts.find(
    (item) => item.id === accountId,
  );

  const numericAmount = Number(amount);

  const copyAccount = async () => {
    if (!account) return;

    await navigator.clipboard.writeText(
      account.accountNumber,
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const handleDeposit = async () => {
    if (
      !amount ||
      numericAmount <= 0 ||
      !transactionId.trim()
    ) {
      return;
    }

    try {
      setLoading(true);

      // TODO: call your backend here
      // await createEtbDeposit({
      //   amount: numericAmount,
      //   payment_method: accountId,
      //   transaction_id: transactionId.trim(),
      // });

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );

      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full px-2 py-2">
        <div className="rounded-xl border bg-card p-3 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Check className="h-4 w-4 text-primary" />
          </div>

          <h2 className="mt-2 text-sm font-semibold">
            Deposit Submitted
          </h2>

          <p className="mt-1 text-[10px] leading-tight text-muted-foreground">
            Your ETB deposit is waiting for verification.
          </p>

          <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">
                Amount
              </span>

              <span className="font-semibold">
                {numericAmount.toLocaleString()} ETB
              </span>
            </div>

            <div className="mt-1 flex justify-between text-[11px]">
              <span className="text-muted-foreground">
                Method
              </span>

              <span className="font-medium">
                {account?.name}
              </span>
            </div>

            <div className="mt-1 flex justify-between text-[11px]">
              <span className="text-muted-foreground">
                Status
              </span>

              <span className="font-medium text-amber-600">
                Pending
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-3 h-8 w-full rounded-lg text-[11px]"
            onClick={() => {
              setSubmitted(false);
              setAmount("");
              setTransactionId("");
            }}
          >
            New Deposit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 py-2">
      {/* Header */}
      <div className="mb-2.5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <ArrowDownToLine className="h-3.5 w-3.5 text-primary" />
        </div>

        <div>
          <h1 className="text-sm font-semibold leading-none">
            Deposit ETB
          </h1>

          <p className="mt-0.5 text-[9px] text-muted-foreground">
            Add funds to your ETB wallet
          </p>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-2">
        <label className="mb-1 block text-[10px] font-medium">
          Amount
        </label>

        <div className="relative">
          <Input
            type="number"
            inputMode="decimal"
            min="1"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-9 rounded-lg pr-12 text-xs"
          />

          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">
            ETB
          </span>
        </div>
      </div>

      {/* Payment method */}
      <div className="mb-2">
        <label className="mb-1 block text-[10px] font-medium">
          Payment method
        </label>

        <Select
          value={accountId}
          onValueChange={setAccountId}
        >
          <SelectTrigger className="h-9 rounded-lg text-[11px]">
            <SelectValue />
          </SelectTrigger>

          <SelectContent className="rounded-lg">
            {paymentAccounts.map((item) => (
              <SelectItem
                key={item.id}
                value={item.id}
                className="text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    {item.type === "bank" ? (
                      <Building2 className="h-3 w-3 text-primary" />
                    ) : (
                      <Smartphone className="h-3 w-3 text-primary" />
                    )}
                  </div>

                  <span>{item.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Account */}
      {account && (
        <div className="mb-2 rounded-lg border bg-muted/30 px-2.5 py-2">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[9px] text-muted-foreground">
                Send payment to
              </p>

              <p className="text-[11px] font-semibold">
                {account.name}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={copyAccount}
            >
              {copied ? (
                <Check className="h-3 w-3 text-primary" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>

          <div className="mt-1.5 flex items-center justify-between rounded-md bg-background px-2 py-1.5">
            <div className="min-w-0">
              <p className="text-[9px] text-muted-foreground">
                Account
              </p>

              <p className="truncate font-mono text-[11px] font-semibold">
                {account.accountNumber}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction ID */}
      <div className="mb-2">
        <label className="mb-1 block text-[10px] font-medium">
          Transaction ID
        </label>

        <Input
          value={transactionId}
          onChange={(e) =>
            setTransactionId(e.target.value)
          }
          placeholder="Enter transaction ID"
          className="h-9 rounded-lg text-[11px]"
        />
      </div>

      {/* Deposit button */}
      <Button
        className="h-9 w-full rounded-lg text-[11px] font-semibold"
        onClick={handleDeposit}
        disabled={
          loading ||
          !amount ||
          numericAmount <= 0 ||
          !transactionId.trim()
        }
      >
        {loading ? (
          <>
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ArrowDownToLine className="mr-1.5 h-3.5 w-3.5" />
            Deposit ETB
          </>
        )}
      </Button>

      <p className="mt-1.5 text-center text-[8px] leading-tight text-muted-foreground">
        Deposit is credited after transaction verification.
      </p>
    </div>
  );
}
