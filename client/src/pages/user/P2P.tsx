import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  Filter,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TradeType = "buy" | "sell";

interface P2POrder {
  id: string;
  username: string;
  verified: boolean;
  rating: number;
  completedOrders: number;
  completionRate: number;
  price: number;
  available: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
  online: boolean;
  avgTime: string;
}

const sellOrders: P2POrder[] = [
  {
    id: "sell-1",
    username: "CryptoMerchant",
    verified: true,
    rating: 4.98,
    completedOrders: 1284,
    completionRate: 99.7,
    price: 154.2,
    available: 1250,
    minLimit: 500,
    maxLimit: 50000,
    paymentMethods: ["Telebirr", "Bank"],
    online: true,
    avgTime: "5 min",
  },
  {
    id: "sell-2",
    username: "USDTTrader",
    verified: true,
    rating: 4.96,
    completedOrders: 876,
    completionRate: 99.2,
    price: 154.5,
    available: 840,
    minLimit: 1000,
    maxLimit: 35000,
    paymentMethods: ["Bank"],
    online: true,
    avgTime: "8 min",
  },
  {
    id: "sell-3",
    username: "FastExchange",
    verified: false,
    rating: 4.91,
    completedOrders: 512,
    completionRate: 98.8,
    price: 154.8,
    available: 420,
    minLimit: 500,
    maxLimit: 20000,
    paymentMethods: ["Telebirr"],
    online: true,
    avgTime: "10 min",
  },
  {
    id: "sell-4",
    username: "EtyTrader",
    verified: true,
    rating: 4.94,
    completedOrders: 341,
    completionRate: 98.9,
    price: 155.1,
    available: 675,
    minLimit: 1000,
    maxLimit: 25000,
    paymentMethods: ["Telebirr", "Bank"],
    online: false,
    avgTime: "15 min",
  },
];

const buyOrders: P2POrder[] = [
  {
    id: "buy-1",
    username: "USDTBuyer",
    verified: true,
    rating: 4.99,
    completedOrders: 1102,
    completionRate: 99.8,
    price: 153.7,
    available: 980,
    minLimit: 500,
    maxLimit: 40000,
    paymentMethods: ["Telebirr", "Bank"],
    online: true,
    avgTime: "5 min",
  },
  {
    id: "buy-2",
    username: "DigitalBuyer",
    verified: true,
    rating: 4.97,
    completedOrders: 763,
    completionRate: 99.4,
    price: 153.5,
    available: 720,
    minLimit: 1000,
    maxLimit: 30000,
    paymentMethods: ["Bank"],
    online: true,
    avgTime: "7 min",
  },
  {
    id: "buy-3",
    username: "ETBTrader",
    verified: false,
    rating: 4.92,
    completedOrders: 438,
    completionRate: 98.5,
    price: 153.2,
    available: 350,
    minLimit: 500,
    maxLimit: 15000,
    paymentMethods: ["Telebirr"],
    online: true,
    avgTime: "9 min",
  },
  {
    id: "buy-4",
    username: "QuickBuyer",
    verified: true,
    rating: 4.95,
    completedOrders: 287,
    completionRate: 98.9,
    price: 153.0,
    available: 590,
    minLimit: 1000,
    maxLimit: 20000,
    paymentMethods: ["Telebirr", "Bank"],
    online: false,
    avgTime: "12 min",
  },
];

const formatETB = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);

const formatUSDT = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);

function MerchantAvatar({
  username,
  online,
}: {
  username: string;
  online: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <UserRound className="h-5 w-5 text-muted-foreground" />
      </div>

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
      )}
    </div>
  );
}

function OrderCard({
  order,
  type,
}: {
  order: P2POrder;
  type: TradeType;
}) {
  const isBuy = type === "buy";

  return (
    <Card className="rounded-2xl transition-all hover:shadow-md">
      <CardContent className="p-4">
        {/* Merchant */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <MerchantAvatar
              username={order.username}
              online={order.online}
            />

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">
                  {order.username}
                </span>

                {order.verified && (
                  <BadgeCheck className="h-4 w-4 text-blue-500" />
                )}
              </div>

              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                  {order.rating}
                </span>

                <span>•</span>

                <span>
                  {order.completedOrders.toLocaleString()} trades
                </span>
              </div>
            </div>
          </div>

          <Badge
            variant={order.online ? "secondary" : "outline"}
            className={
              order.online
                ? "text-emerald-600"
                : "text-muted-foreground"
            }
          >
            {order.online ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Price */}
        <div className="mt-5 rounded-xl bg-muted/50 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Price
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight">
                {formatETB(order.price)}
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  ETB
                </span>
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                Available
              </p>

              <p className="mt-1 font-semibold">
                {formatUSDT(order.available)} USDT
              </p>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Order limits
            </p>

            <p className="mt-1 text-sm font-medium">
              {formatETB(order.minLimit)} –{" "}
              {formatETB(order.maxLimit)} ETB
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Completion
            </p>

            <p className="mt-1 text-sm font-medium text-emerald-600">
              {order.completionRate}%
            </p>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">
            Payment methods
          </p>

          <div className="flex flex-wrap gap-2">
            {order.paymentMethods.map((method) => (
              <Badge
                key={method}
                variant="outline"
                className="rounded-lg"
              >
                {method}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" />
            Usually {order.avgTime}
          </div>

          <Button
            className={`rounded-xl px-5 ${isBuy
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {isBuy ? "Buy USDT" : "Sell USDT"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function P2P() {
  const [tab, setTab] = useState<TradeType>("buy");
  const [search, setSearch] = useState("");

  const orders = tab === "buy" ? sellOrders : buyOrders;

  const filteredOrders = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return orders;
    }

    return orders.filter((order) =>
      order.username.toLowerCase().includes(value),
    );
  }, [orders, search]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted">
            <ArrowDownLeft className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              P2P Trading
            </h1>

            <p className="text-sm text-muted-foreground">
              Buy and sell USDT directly with other users
            </p>
          </div>
        </div>
      </div>

      {/* Security banner */}
      <Card className="mb-5 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Protected P2P trading
            </p>

            <p className="text-xs text-muted-foreground">
              EtyPoto holds the crypto in escrow while
              your trade is completed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Buy / Sell */}
      <Tabs
        value={tab}
        onValueChange={(value) =>
          setTab(value as TradeType)
        }
      >
        <TabsList className="grid h-12 w-full grid-cols-2 rounded-xl">
          <TabsTrigger
            value="buy"
            className="rounded-lg"
          >
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Buy USDT
          </TabsTrigger>

          <TabsTrigger
            value="sell"
            className="rounded-lg"
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Sell USDT
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search + filter */}
      <div className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search merchant..."
            className="h-11 rounded-xl pl-9"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 rounded-xl"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Current market */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            {tab === "buy"
              ? "Buy USDT"
              : "Sell USDT"}
          </p>

          <p className="text-xs text-muted-foreground">
            {tab === "buy"
              ? "People selling USDT"
              : "People buying USDT"}
          </p>
        </div>

        <Badge
          variant="outline"
          className="rounded-lg"
        >
          USDT / ETB
        </Badge>
      </div>

      {/* Orders */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            type={tab}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredOrders.length === 0 && (
        <Card className="mt-4 rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 font-semibold">
              No offers found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Try searching for another merchant.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create order */}
      <Card className="mt-6 rounded-2xl border-dashed">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">
              Want to create your own offer?
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Post an order and let other users trade
              with you.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-xl"
          >
            Create P2P Offer
          </Button>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mt-5 text-center text-xs text-muted-foreground">
        <p>
          Always verify the payment details before
          completing a trade.
        </p>
      </div>
    </main>
  );
}