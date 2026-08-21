import { getMybalance } from "@/api/wallet";
import { useQuery } from "@tanstack/react-query";
import {
    ArrowDownToLine,
    ArrowUpFromLine,
    Eye,
    EyeOff,
    Wallet as WalletIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Portfolio() {
    const [showBalance, setShowBalance] = useState(true);

    const { data, error, isLoading } = useQuery({
        queryKey: ["getMybalance"],
        queryFn: getMybalance,
    });

    const wallets = data?.wallets ?? [];

    const usdtWallet = wallets.find(
        (wallet: any) => wallet.asset === "USDT"
    );

    const etbWallet = wallets.find(
        (wallet: any) => wallet.asset === "ETB"
    );

    const usdtBalance = Number(usdtWallet?.available_balance ?? 0);
    const etbBalance = Number(etbWallet?.available_balance ?? 0);

    const formatBalance = (value: number) => {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    if (isLoading) {
        return (
            <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardContent className="p-4">
                    <div className="animate-pulse space-y-4">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <div className="h-3 w-20 rounded bg-muted" />
                                <div className="h-7 w-32 rounded bg-muted" />
                            </div>

                            <div className="h-8 w-8 rounded-lg bg-muted" />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-24 rounded-xl bg-muted" />
                            <div className="h-24 rounded-xl bg-muted" />
                        </div>

                        <div className="h-8 rounded-lg bg-muted" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="rounded-2xl border-destructive/20 bg-card shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                            <WalletIcon className="h-3.5 w-3.5 text-destructive" />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-foreground">
                                Unable to load wallet
                            </p>

                            <p className="text-[10px] text-muted-foreground">
                                Please try again later.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardContent>

                {/* Header */}
                <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                            <WalletIcon className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-card-foreground">
                                Wallet
                            </p>

                            <p className="text-[10px] text-muted-foreground">
                                Available balances
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowBalance((value) => !value)}
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        {showBalance ? (
                            <Eye className="h-3.5 w-3.5" />
                        ) : (
                            <EyeOff className="h-3.5 w-3.5" />
                        )}
                    </Button>
                </div>

                {/* Wallet balances */}
                <div className="grid grid-cols-2 gap-2">

                    {/* USDT */}
                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-[10px] font-bold text-primary">
                                        $
                                    </span>
                                </div>

                                <span className="text-[11px] font-semibold text-foreground">
                                    USDT
                                </span>
                            </div>

                            <span className="text-[9px] text-muted-foreground">
                                Crypto
                            </span>
                        </div>

                        <p className="mt-3 truncate text-base font-bold tracking-tight text-foreground">
                            {showBalance
                                ? formatBalance(usdtBalance)
                                : "••••••"}
                        </p>

                        <p className="mt-0.5 text-[9px] text-muted-foreground">
                            Available
                        </p>
                    </div>

                    {/* ETB */}
                    <div className="rounded-xl border border-border bg-muted/40 p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-[9px] font-bold text-primary">
                                        Br
                                    </span>
                                </div>

                                <span className="text-[11px] font-semibold text-foreground">
                                    ETB
                                </span>
                            </div>

                            <span className="text-[9px] text-muted-foreground">
                                Fiat
                            </span>
                        </div>

                        <p className="mt-3 truncate text-base font-bold tracking-tight text-foreground">
                            {showBalance
                                ? formatBalance(etbBalance)
                                : "••••••"}
                        </p>

                        <p className="mt-0.5 text-[9px] text-muted-foreground">
                            Available
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className=" grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        className="h-8 rounded-lg border-border bg-background text-[11px] font-medium text-foreground shadow-none hover:bg-muted"
                    >
                        <ArrowDownToLine className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Deposit
                    </Button>

                    <Button
                        variant="outline"
                        className="h-8 rounded-lg border-border bg-background text-[11px] font-medium text-foreground shadow-none hover:bg-muted"
                    >
                        <ArrowUpFromLine className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Withdraw
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
}