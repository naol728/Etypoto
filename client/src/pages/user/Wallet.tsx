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
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============ TYPES ============
type Asset = "ETB" | "USDT";

type TransactionType = "deposit" | "withdraw" | "buy" | "sell";

type TransactionStatus = "completed" | "pending" | "failed";

interface WalletAsset {
  asset: Asset;
  balance: number;
  lockedBalance: number;
  address?: string;
}

interface Transaction {
  id: string;
  asset: Asset;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  reference: string;
  description?: string;
}

// ============ MOCK DATA ============
const walletData: WalletAsset[] = [
  {
    asset: "ETB",
    balance: 24500,
    lockedBalance: 1500,
    address: "ETB_001_7X9K2M",
  },
  {
    asset: "USDT",
    balance: 125.5,
    lockedBalance: 20,
    address: "0x7a3...9f2e",
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
    description: "Deposit from external wallet",
  },
  {
    id: "tx_002",
    asset: "USDT",
    type: "buy",
    amount: 75.5,
    status: "completed",
    createdAt: "Today, 14:21",
    reference: "P2P-BUY-12841",
    description: "P2P purchase from @user123",
  },
  {
    id: "tx_003",
    asset: "USDT",
    type: "withdraw",
    amount: 20,
    status: "pending",
    createdAt: "Yesterday, 20:15",
    reference: "USDT-WD-72931",
    description: "Withdrawal request",
  },
  {
    id: "tx_004",
    asset: "ETB",
    type: "deposit",
    amount: 15000,
    status: "completed",
    createdAt: "Yesterday, 16:30",
    reference: "ETB-DP-18291",
    description: "Bank transfer deposit",
  },
  {
    id: "tx_005",
    asset: "ETB",
    type: "buy",
    amount: 8500,
    status: "completed",
    createdAt: "Aug 18, 12:41",
    reference: "P2P-BUY-18281",
    description: "P2P purchase from @trader456",
  },
  {
    id: "tx_006",
    asset: "ETB",
    type: "withdraw",
    amount: 4000,
    status: "failed",
    createdAt: "Aug 17, 19:20",
    reference: "ETB-WD-17291",
    description: "Failed withdrawal - insufficient balance",
  },
];

// ============ UTILITY FUNCTIONS ============
const formatAmount = (amount: number, asset: Asset): string => {
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: asset === "USDT" ? 6 : 2,
    maximumFractionDigits: asset === "USDT" ? 6 : 2,
  };
  return amount.toLocaleString("en-US", options);
};

const formatCurrency = (amount: number, asset: Asset): string => {
  const symbol = asset === "ETB" ? "Br" : "$";
  return `${symbol}${formatAmount(amount, asset)}`;
};

const transactionLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    deposit: "Deposit",
    withdraw: "Withdrawal",
    buy: "P2P Buy",
    sell: "P2P Sell",
  };
  return labels[type];
};

const statusConfig = (status: TransactionStatus): {
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ReactNode;
  label: string;
} => {
  const configs: Record<TransactionStatus, any> = {
    completed: {
      variant: "default",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Completed",
    },
    pending: {
      variant: "secondary",
      icon: <Clock className="h-3 w-3" />,
      label: "Pending",
    },
    failed: {
      variant: "destructive",
      icon: <XCircle className="h-3 w-3" />,
      label: "Failed",
    },
  };
  return configs[status];
};

// ============ MAIN COMPONENT ============
export default function Wallet() {
  const [activeAsset, setActiveAsset] = useState<Asset>("USDT");
  const [isLoading, setIsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);

  const etbWallet = walletData.find((w) => w.asset === "ETB")!;
  const usdtWallet = walletData.find((w) => w.asset === "USDT")!;

  const totalBalance = useMemo(() => {
    // Simplified conversion rate (in a real app, fetch from API)
    const rate = 55; // 1 USDT = 55 ETB
    return etbWallet.balance + usdtWallet.balance * rate;
  }, []);

  const filteredTransactions = useMemo(
    () => transactions.filter((t) => t.asset === activeAsset),
    [activeAsset]
  );

  const totalTransactions = filteredTransactions.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-2xl px-4 py-4">
        {/* Header */}
        <Header />

        {/* Portfolio Card */}
        <PortfolioCard
          totalBalance={totalBalance}
          showBalance={showBalance}
          setShowBalance={setShowBalance}
        />

        {/* Wallet Cards */}
        <WalletCardsSection
          etbWallet={etbWallet}
          usdtWallet={usdtWallet}
        />

        {/* Action Buttons */}
        <ActionButtons />

        {/* Transaction History */}
        <TransactionHistorySection
          activeAsset={activeAsset}
          setActiveAsset={setActiveAsset}
          filteredTransactions={filteredTransactions}
          totalTransactions={totalTransactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// ============ SUB-COMPONENTS ============

function Header() {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Your wallet</p>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <WalletCards className="h-5 w-5 text-primary" />
      </div>
    </div>
  );
}

interface PortfolioCardProps {
  totalBalance: number;
  showBalance: boolean;
  setShowBalance: (show: boolean) => void;
}

function PortfolioCard({ totalBalance, showBalance, setShowBalance }: PortfolioCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg">
      {/* Decorative elements */}
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute right-12 top-12 h-16 w-16 rounded-full bg-white/5" />

      <CardContent className="relative p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-foreground/70">Total Portfolio</p>
            <div className="mt-1 flex items-end gap-2">
              <h2 className="text-3xl font-bold tracking-tight">
                {showBalance ? (
                  `Br ${formatAmount(totalBalance, "ETB")}`
                ) : (
                  "••••••••"
                )}
              </h2>
            </div>
            <p className="mt-1 text-xs text-primary-foreground/60">
              Combined value of your ETB and USDT holdings
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? (
              <Lock className="h-4 w-4" />
            ) : (
              <WalletCards className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Mini stats */}
        <div className="mt-4 flex gap-4">
          <div>
            <p className="text-xs text-primary-foreground/60">ETB</p>
            <p className="text-sm font-semibold">
              {showBalance ? formatAmount(24500, "ETB") : "••••"}
            </p>
          </div>
          <div>
            <p className="text-xs text-primary-foreground/60">USDT</p>
            <p className="text-sm font-semibold">
              {showBalance ? formatAmount(125.5, "USDT") : "••••"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface WalletCardsSectionProps {
  etbWallet: WalletAsset;
  usdtWallet: WalletAsset;
}

function WalletCardsSection({ etbWallet, usdtWallet }: WalletCardsSectionProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = (address: string, asset: Asset) => {
    navigator.clipboard.writeText(address);
    setCopied(asset);
    setTimeout(() => setCopied(null), 2000);
  };

  const wallets = [
    {
      asset: "ETB" as const,
      data: etbWallet,
      icon: <span className="text-sm font-bold text-emerald-600">Br</span>,
      iconBg: "bg-emerald-500/10",
      gradient: "from-emerald-500/10 to-emerald-500/5",
      badgeColor: "bg-emerald-500/20 text-emerald-700",
    },
    {
      asset: "USDT" as const,
      data: usdtWallet,
      icon: <CircleDollarSign className="h-5 w-5 text-green-600" />,
      iconBg: "bg-green-500/10",
      gradient: "from-green-500/10 to-green-500/5",
      badgeColor: "bg-green-500/20 text-green-700",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {wallets.map(({ asset, data, icon, iconBg, gradient, badgeColor }) => (
        <Card key={asset} className={cn("overflow-hidden", `bg-gradient-to-br ${gradient}`)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-full", iconBg)}>
                {icon}
              </div>
              <Badge className={cn("border-0 font-medium", badgeColor)}>
                {asset}
              </Badge>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">Available Balance</p>
            <p className="mt-0.5 text-lg font-bold">
              {formatAmount(data.balance, asset)}
            </p>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              Locked: {formatAmount(data.lockedBalance, asset)}
            </div>

            {data.address && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                      onClick={() => copyAddress(data.address!, asset)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      {copied === asset ? "Copied!" : data.address.slice(0, 8)}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      <Button size="lg" className="h-11 gap-2 shadow-sm">
        <ArrowDownToLine className="h-4 w-4" />
        Deposit
      </Button>
      <Button size="lg" variant="outline" className="h-11 gap-2">
        <ArrowUpFromLine className="h-4 w-4" />
        Withdraw
      </Button>
    </div>
  );
}

interface TransactionHistorySectionProps {
  activeAsset: Asset;
  setActiveAsset: (asset: Asset) => void;
  filteredTransactions: Transaction[];
  totalTransactions: number;
  isLoading: boolean;
}

function TransactionHistorySection({
  activeAsset,
  setActiveAsset,
  filteredTransactions,
  totalTransactions,
  isLoading,
}: TransactionHistorySectionProps) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h2 className="font-semibold">Transaction History</h2>
          <Badge variant="secondary" className="ml-1">
            {totalTransactions}
          </Badge>
        </div>

        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
          <RefreshCw className="h-3 w-3" />
          Refresh
        </Button>
      </div>

      <Tabs
        value={activeAsset}
        onValueChange={(value) => setActiveAsset(value as Asset)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="USDT">USDT</TabsTrigger>
          <TabsTrigger value="ETB">ETB</TabsTrigger>
        </TabsList>

        <TabsContent value="USDT" className="mt-3">
          <TransactionList
            transactions={filteredTransactions}
            asset="USDT"
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="ETB" className="mt-3">
          <TransactionList
            transactions={filteredTransactions}
            asset="ETB"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
  asset: Asset;
  isLoading?: boolean;
}

function TransactionList({ transactions, asset, isLoading }: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">No transactions</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your {asset} transactions will appear here.
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Start Trading
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-28rem)] pr-2">
      <div className="space-y-2">
        {transactions.map((transaction) => {
          const isIncoming = transaction.type === "deposit" || transaction.type === "sell";
          const status = statusConfig(transaction.status);

          return (
            <Card
              key={transaction.id}
              className="cursor-pointer transition-all hover:border-primary/20 hover:shadow-sm"
            >
              <CardContent className="flex items-center gap-3 p-3">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    isIncoming ? "bg-emerald-500/10" : "bg-orange-500/10"
                  )}
                >
                  {isIncoming ? (
                    <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-orange-600" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {transactionLabel(transaction.type)}
                    </p>
                    <Badge
                      variant={status.variant}
                      className="flex items-center gap-1 text-[10px]"
                    >
                      {status.icon}
                      {status.label}
                    </Badge>
                  </div>

                  {transaction.description && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {transaction.description}
                    </p>
                  )}

                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-3 w-3" />
                    {transaction.createdAt}
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-[10px]">{transaction.reference}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      isIncoming ? "text-emerald-600" : "text-orange-600"
                    )}
                  >
                    {isIncoming ? "+" : "-"}
                    {formatAmount(transaction.amount, asset)}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{asset}</p>
                </div>

                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}