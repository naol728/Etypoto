import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronRight,
  Clock3,
  Copy,
  History,
  Lock,
  WalletCards,
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Asset = "ETB" | "USDT";

type TransactionType =
  | "deposit"
  | "withdraw"
  | "buy"
  | "sell";

type TransactionStatus =
  | "completed"
  | "pending"
  | "failed";

interface WalletAsset {
  asset: Asset;
  balance: number;
  lockedBalance: number;
}

interface Transaction {
  id: string;
  asset: Asset;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  reference: string;
}

const walletData: WalletAsset[] = [
  {
    asset: "ETB",
    balance: 24500,
    lockedBalance: 1500,
  },
  {
    asset: "USDT",
    balance: 125.5,
    lockedBalance: 20,
  },
];

const transactions: Transaction[] = [
  {
    id: "tx_001",
    asset: "USDT",
    type: "deposit",
    amount: 50,
    status: "completed",
    createdAt: "Today, 18:42",
    reference: "USDT-DP-82931",
  },
  {
    id: "tx_002",
    asset: "USDT",
    type: "buy",
    amount: 75.5,
    status: "completed",
    createdAt: "Today, 14:21",
    reference: "P2P-BUY-12841",
  },
  {
    id: "tx_003",
    asset: "USDT",
    type: "withdraw",
    amount: 20,
    status: "pending",
    createdAt: "Yesterday, 20:15",
    reference: "USDT-WD-72931",
  },
  {
    id: "tx_004",
    asset: "ETB",
    type: "deposit",
    amount: 15000,
    status: "completed",
    createdAt: "Yesterday, 16:30",
    reference: "ETB-DP-18291",
  },
  {
    id: "tx_005",
    asset: "ETB",
    type: "buy",
    amount: 8500,
    status: "completed",
    createdAt: "Aug 18, 12:41",
    reference: "P2P-BUY-18281",
  },
  {
    id: "tx_006",
    asset: "ETB",
    type: "withdraw",
    amount: 4000,
    status: "failed",
    createdAt: "Aug 17, 19:20",
    reference: "ETB-WD-17291",
  },
];

const formatAmount = (
  amount: number,
  asset: Asset,
) => {
  if (asset === "USDT") {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  }

  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const transactionLabel = (type: TransactionType) => {
  switch (type) {
    case "deposit":
      return "Deposit";
    case "withdraw":
      return "Withdrawal";
    case "buy":
      return "P2P Buy";
    case "sell":
      return "P2P Sell";
  }
};

const statusVariant = (status: TransactionStatus) => {
  switch (status) {
    case "completed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
  }
};

export default function Wallet() {
  const [activeAsset, setActiveAsset] =
    useState<Asset>("USDT");

  const etbWallet = walletData.find(
    (wallet) => wallet.asset === "ETB",
  )!;

  const usdtWallet = walletData.find(
    (wallet) => wallet.asset === "USDT",
  )!;

  const totalTransactions = useMemo(
    () => transactions.filter(
      (transaction) =>
        transaction.asset === activeAsset,
    ),
    [activeAsset],
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto w-full max-w-2xl px-4 py-5">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Your wallet
            </p>

            <h1 className="text-2xl font-bold tracking-tight">
              Wallet
            </h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <WalletCards className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Portfolio */}
        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-lg">
          <CardContent className="relative p-5">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

            <p className="text-sm text-primary-foreground/70">
              Estimated portfolio
            </p>

            <div className="mt-2 flex items-end gap-2">
              <h2 className="text-3xl font-bold">
                42,675.00
              </h2>

              <span className="mb-1 text-sm opacity-70">
                ETB
              </span>
            </div>

            <p className="mt-1 text-xs text-primary-foreground/60">
              Combined value of your ETB and USDT
              holdings
            </p>
          </CardContent>
        </Card>

        {/* Wallet cards */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* ETB */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                  <span className="text-sm font-bold text-emerald-600">
                    Br
                  </span>
                </div>

                <Badge variant="secondary">
                  ETB
                </Badge>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Available
              </p>

              <p className="mt-1 text-lg font-bold">
                {formatAmount(
                  etbWallet.balance,
                  "ETB",
                )}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Locked{" "}
                {formatAmount(
                  etbWallet.lockedBalance,
                  "ETB",
                )}
              </p>
            </CardContent>
          </Card>

          {/* USDT */}
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                  <CircleDollarSign className="h-5 w-5 text-green-600" />
                </div>

                <Badge variant="secondary">
                  USDT
                </Badge>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Available
              </p>

              <p className="mt-1 text-lg font-bold">
                {formatAmount(
                  usdtWallet.balance,
                  "USDT",
                )}
              </p>

              <p className="mt-1 text-[11px] text-muted-foreground">
                Locked{" "}
                {formatAmount(
                  usdtWallet.lockedBalance,
                  "USDT",
                )}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            size="lg"
            className="h-12 gap-2"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Deposit
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 gap-2"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Withdraw
          </Button>
        </div>

        {/* Asset selector + transactions */}
        <div className="mt-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5" />

            <h2 className="font-semibold">
              Transaction history
            </h2>
          </div>

          <Tabs
            value={activeAsset}
            onValueChange={(value) =>
              setActiveAsset(value as Asset)
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="USDT">
                USDT
              </TabsTrigger>

              <TabsTrigger value="ETB">
                ETB
              </TabsTrigger>
            </TabsList>

            <TabsContent value="USDT">
              <TransactionList
                transactions={totalTransactions}
                asset="USDT"
              />
            </TabsContent>

            <TabsContent value="ETB">
              <TransactionList
                transactions={totalTransactions}
                asset="ETB"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  asset: Asset;
}

function TransactionList({
  transactions,
  asset,
}: TransactionListProps) {
  const filtered = transactions.filter(
    (transaction) =>
      transaction.asset === asset,
  );

  if (!filtered.length) {
    return (
      <Card className="mt-3">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <History className="h-8 w-8 text-muted-foreground" />

          <p className="mt-3 font-medium">
            No transactions
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Your {asset} transactions will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-3 space-y-2">
      {filtered.map((transaction) => {
        const incoming =
          transaction.type === "deposit" ||
          transaction.type === "sell";

        return (
          <Card
            key={transaction.id}
            className="transition hover:bg-muted/40"
          >
            <CardContent className="flex items-center gap-3  ">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${incoming
                  ? "bg-emerald-500/10"
                  : "bg-orange-500/10"
                  }`}
              >
                {incoming ? (
                  <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ArrowUpRight className="h-5 w-5 text-orange-600" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {transactionLabel(
                      transaction.type,
                    )}
                  </p>

                  <Badge
                    variant={statusVariant(
                      transaction.status,
                    )}
                    className="text-[10px]"
                  >
                    {transaction.status}
                  </Badge>
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock3 className="h-3 w-3" />
                  {transaction.createdAt}
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-sm font-semibold ${incoming
                    ? "text-emerald-600"
                    : "text-orange-600"
                    }`}
                >
                  {incoming ? "+" : "-"}
                  {formatAmount(
                    transaction.amount,
                    asset,
                  )}
                </p>

                <p className="mt-1 text-[10px] text-muted-foreground">
                  {asset}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}