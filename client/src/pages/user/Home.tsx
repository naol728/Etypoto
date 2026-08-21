import {
  ChevronRight,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hook";
import Portfolio from "@/components/user/Portfolio";

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  icon: string;
}

const cryptoData: Crypto[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    price: 117842.42,
    change24h: 4.82,
    marketCap: 2340000000000,
    icon: "₿",
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    price: 4328.17,
    change24h: 3.21,
    marketCap: 522000000000,
    icon: "Ξ",
  },
  {
    id: "solana",
    symbol: "SOL",
    name: "Solana",
    price: 198.42,
    change24h: 8.74,
    marketCap: 96000000000,
    icon: "S",
  },
  {
    id: "bnb",
    symbol: "BNB",
    name: "BNB",
    price: 682.91,
    change24h: 2.17,
    marketCap: 105000000000,
    icon: "B",
  },
  {
    id: "xrp",
    symbol: "XRP",
    name: "XRP",
    price: 3.12,
    change24h: -2.64,
    marketCap: 185000000000,
    icon: "X",
  },
  {
    id: "doge",
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.2418,
    change24h: -4.81,
    marketCap: 35600000000,
    icon: "Ð",
  },
  {
    id: "ada",
    symbol: "ADA",
    name: "Cardano",
    price: 0.8732,
    change24h: -3.42,
    marketCap: 31200000000,
    icon: "A",
  },
  {
    id: "avax",
    symbol: "AVAX",
    name: "Avalanche",
    price: 41.28,
    change24h: -1.87,
    marketCap: 17400000000,
    icon: "A",
  },
];

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatMarketCap = (value: number) => {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }

  return `$${formatMoney(value)}`;
};

function CryptoIcon({
  symbol,
  icon,
}: {
  symbol: string;
  icon: string;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
      {icon}
    </div>
  );
}

function CryptoRow({ crypto }: { crypto: Crypto }) {
  const positive = crypto.change24h >= 0;

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted/50">
      <CryptoIcon
        symbol={crypto.symbol}
        icon={crypto.icon}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            {crypto.symbol}
          </span>

          <span className="hidden text-xs text-muted-foreground sm:block">
            {crypto.name}
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          MC {formatMarketCap(crypto.marketCap)}
        </p>
      </div>

      <div className="text-right">
        <p className="font-medium">
          ${formatMoney(crypto.price)}
        </p>

        <div
          className={`flex items-center justify-end gap-1 text-xs font-medium ${positive
            ? "text-emerald-500"
            : "text-red-500"
            }`}
        >
          {positive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}

          {positive ? "+" : ""}
          {crypto.change24h.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const user = useAppSelector((state) => state.auth.user)

  const gainers = [...cryptoData]
    .filter((coin) => coin.change24h > 0)
    .sort((a, b) => b.change24h - a.change24h)
    .slice(0, 4);

  const losers = [...cryptoData]
    .filter((coin) => coin.change24h < 0)
    .sort((a, b) => a.change24h - b.change24h)
    .slice(0, 4);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-4 sm:px-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Welcome back {user?.telegram_first_name}
          </p>
        </div>
      </div>

      {/* Portfolio */}
      <Portfolio />

      {/* Market Overview */}
      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              Market Overview
            </h2>

            <p className="text-sm text-muted-foreground">
              Crypto market today
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Gainers */}
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Top Gainers
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      24h performance
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="text-emerald-500"
                >
                  Rising
                </Badge>
              </div>

              <div className="divide-y">
                {gainers.map((crypto) => (
                  <CryptoRow
                    key={crypto.id}
                    crypto={crypto}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Top Losers
                    </h3>

                    <p className="text-xs text-muted-foreground">
                      24h performance
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="text-red-500"
                >
                  Falling
                </Badge>
              </div>

              <div className="divide-y">
                {losers.map((crypto) => (
                  <CryptoRow
                    key={crypto.id}
                    crypto={crypto}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Market Cap */}
      <section className="mt-7">
        <div className="mb-4">
          <h2 className="text-lg font-bold">
            Market
          </h2>

          <p className="text-sm text-muted-foreground">
            Popular cryptocurrencies
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-3 sm:p-4">
            <div className="hidden grid-cols-[1fr_120px_100px_100px] gap-4 border-b px-2 pb-3 text-xs font-medium text-muted-foreground sm:grid">
              <span>Asset</span>
              <span className="text-right">
                Price
              </span>
              <span className="text-right">
                24h
              </span>
              <span className="text-right">
                Market Cap
              </span>
            </div>

            <div className="divide-y">
              {cryptoData.map((crypto) => {
                const positive =
                  crypto.change24h >= 0;

                return (
                  <div
                    key={crypto.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-3 px-2 py-4 sm:grid-cols-[1fr_120px_100px_100px]"
                  >
                    <div className="flex items-center gap-3">
                      <CryptoIcon
                        symbol={crypto.symbol}
                        icon={crypto.icon}
                      />

                      <div>
                        <p className="font-semibold">
                          {crypto.symbol}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {crypto.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      ${formatMoney(crypto.price)}
                    </div>

                    <div
                      className={`hidden text-right font-medium sm:block ${positive
                        ? "text-emerald-500"
                        : "text-red-500"
                        }`}
                    >
                      {positive ? "+" : ""}
                      {crypto.change24h.toFixed(2)}%
                    </div>

                    <div className="hidden text-right text-sm text-muted-foreground sm:block">
                      {formatMarketCap(
                        crypto.marketCap,
                      )}
                    </div>

                    <div className="text-right sm:hidden">
                      <span
                        className={
                          positive
                            ? "text-emerald-500"
                            : "text-red-500"
                        }
                      >
                        {positive ? "+" : ""}
                        {crypto.change24h.toFixed(2)}%
                      </span>

                      <p className="text-xs text-muted-foreground">
                        {formatMarketCap(
                          crypto.marketCap,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Info */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <CircleDollarSign className="h-3.5 w-3.5" />
        Market prices are for demonstration only
      </div>
    </main>
  );
}