import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Copy,
  MoreVertical,
  XCircle,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

type OrderStatus =
  | "pending"
  | "completed"
  | "cancelled";

type OrderType = "buy" | "sell";

interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  asset: "USDT";
  amount: number;
  price: number;
  total: number;
  counterparty: string;
  paymentMethod: string;
  createdAt: string;
}

const orders: Order[] = [
  {
    id: "ETP-928471",
    type: "buy",
    status: "pending",
    asset: "USDT",
    amount: 250,
    price: 152.4,
    total: 38100,
    counterparty: "Abebe Trading",
    paymentMethod: "Telebirr",
    createdAt: "Today, 01:42 PM",
  },
  {
    id: "ETP-928320",
    type: "sell",
    status: "completed",
    asset: "USDT",
    amount: 120,
    price: 151.9,
    total: 18228,
    counterparty: "CryptoHub ET",
    paymentMethod: "Bank Transfer",
    createdAt: "Today, 11:25 AM",
  },
  {
    id: "ETP-927815",
    type: "buy",
    status: "completed",
    asset: "USDT",
    amount: 500,
    price: 152.1,
    total: 76050,
    counterparty: "FinTech Ethiopia",
    paymentMethod: "CBE Birr",
    createdAt: "Yesterday, 04:18 PM",
  },
  {
    id: "ETP-927442",
    type: "sell",
    status: "cancelled",
    asset: "USDT",
    amount: 80,
    price: 151.5,
    total: 12120,
    counterparty: "Digital Market",
    paymentMethod: "Telebirr",
    createdAt: "Yesterday, 10:31 AM",
  },
  {
    id: "ETP-926991",
    type: "buy",
    status: "pending",
    asset: "USDT",
    amount: 300,
    price: 152.3,
    total: 45690,
    counterparty: "Addis Exchange",
    paymentMethod: "Bank Transfer",
    createdAt: "Aug 19, 2026",
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

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  if (status === "pending") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 rounded-full px-2.5"
      >
        <Clock3 className="h-3 w-3" />
        Pending
      </Badge>
    );
  }

  if (status === "completed") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 rounded-full px-2.5"
      >
        <CheckCircle2 className="h-3 w-3" />
        Completed
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1 rounded-full px-2.5"
    >
      <XCircle className="h-3 w-3" />
      Cancelled
    </Badge>
  );
}

function OrderCard({ order }: { order: Order }) {
  const isBuy = order.type === "buy";

  return (
    <Card className="border-border/60 shadow-none transition hover:shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${isBuy
                ? "bg-emerald-500/10"
                : "bg-red-500/10"
                }`}
            >
              {isBuy ? (
                <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
              ) : (
                <ArrowUpRight className="h-5 w-5 text-red-600" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">
                  {isBuy ? "Buy" : "Sell"} USDT
                </h3>

                <span className="text-xs text-muted-foreground">
                  #{order.id}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                {order.createdAt}
              </p>
            </div>
          </div>

          <StatusBadge status={order.status} />
        </div>

        {/* Amount */}
        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Amount
            </p>

            <p className="mt-1 text-lg font-semibold">
              {formatUSDT(order.amount)}{" "}
              <span className="text-sm text-muted-foreground">
                USDT
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Total
            </p>

            <p className="mt-1 text-lg font-semibold">
              {formatETB(order.total)}{" "}
              <span className="text-sm text-muted-foreground">
                ETB
              </span>
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2 rounded-xl bg-muted/40 p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Price
            </span>

            <span className="font-medium">
              {formatETB(order.price)} ETB / USDT
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Counterparty
            </span>

            <span className="font-medium">
              {order.counterparty}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Payment
            </span>

            <span className="font-medium">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {order.status === "pending" && (
            <Button
              variant="outline"
              className="flex-1"
            >
              View Order
            </Button>
          )}

          {order.status === "completed" && (
            <Button
              variant="outline"
              className="flex-1"
            >
              View Receipt
            </Button>
          )}

          {order.status === "cancelled" && (
            <Button
              variant="outline"
              className="flex-1"
            >
              View Details
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Copy className="h-6 w-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">
        No orders
      </h3>

      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Your trading orders will appear here.
      </p>
    </div>
  );
}

export default function Orders() {
  const pending = orders.filter(
    (order) => order.status === "pending",
  );

  const completed = orders.filter(
    (order) => order.status === "completed",
  );

  const cancelled = orders.filter(
    (order) => order.status === "cancelled",
  );

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-5">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">
          Trading
        </p>

        <h1 className="text-2xl font-bold tracking-tight">
          Orders
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your USDT P2P orders and transactions.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Card className="border-border/60 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              Total
            </p>
            <p className="mt-1 text-xl font-bold">
              {orders.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              Pending
            </p>
            <p className="mt-1 text-xl font-bold">
              {pending.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-none">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">
              Completed
            </p>
            <p className="mt-1 text-xl font-bold">
              {completed.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="all"
        className="mt-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All
          </TabsTrigger>

          <TabsTrigger value="pending">
            Pending
          </TabsTrigger>

          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>

          <TabsTrigger value="cancelled">
            Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="all"
          className="mt-4 space-y-3"
        >
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </TabsContent>

        <TabsContent
          value="pending"
          className="mt-4 space-y-3"
        >
          {pending.length > 0 ? (
            pending.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))
          ) : (
            <EmptyOrders />
          )}
        </TabsContent>

        <TabsContent
          value="completed"
          className="mt-4 space-y-3"
        >
          {completed.length > 0 ? (
            completed.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))
          ) : (
            <EmptyOrders />
          )}
        </TabsContent>

        <TabsContent
          value="cancelled"
          className="mt-4 space-y-3"
        >
          {cancelled.length > 0 ? (
            cancelled.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))
          ) : (
            <EmptyOrders />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}