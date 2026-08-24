import { useState } from "react";
import {
    ArrowDownToLine,
    Check,
    Copy,
    Loader2,
    ShieldCheck,
    AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Alert, AlertDescription } from "@/components/ui/alert";

import {
    depositWallet,
    getDeposit,
    type CreateUsdtDepositResponse,
} from "@/api/wallet";
import { useQuery } from "@tanstack/react-query";
import { NetworkIcon } from "@/lib/NetworkIcon";

export default function UsdtDeposit() {
    const [amount, setAmount] = useState("");
    const [network, setNetwork] = useState("TRC20");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [deposit, setDeposit] =
        useState<CreateUsdtDepositResponse | null>(null);

    const { data, isLoading: isLoadingNetworks } = useQuery({
        queryKey: ["getDeposit"],
        queryFn: getDeposit,
    });

    const [copied, setCopied] = useState(false);

    // Get available networks from backend data
    const networks = data?.networks || [];

    // Find selected network details
    const selectedNetwork = networks.find(
        (item) => item.network === network
    );

    const handleDeposit = async () => {
        setError(null);

        const numericAmount = Number(amount);

        if (!amount || Number.isNaN(numericAmount)) {
            setError("Please enter a valid amount.");
            return;
        }

        if (numericAmount < 5) {
            setError("Minimum deposit is 5 USDT.");
            return;
        }

        try {
            setLoading(true);

            const response = await depositWallet({
                amount: numericAmount,
                network,
            });

            if (!response.status) {
                throw new Error("Unable to create deposit.");
            }

            setDeposit(response);
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create deposit."
            );
        } finally {
            setLoading(false);
        }
    };

    const copyAddress = async () => {
        if (!deposit?.payment.address) return;

        await navigator.clipboard.writeText(deposit.payment.address);

        window?.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.(
            "success"
        );

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    /* ---------------------------------
       DEPOSIT ADDRESS
    --------------------------------- */

    if (deposit) {
        return (
            <Card className="w-full border-border/60 shadow-sm rounded-xl overflow-hidden">
                <CardContent className="p-2.5 space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 shrink-0">
                            <ArrowDownToLine className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <p className="text-xs font-semibold text-foreground leading-none">
                            Deposit USDT
                        </p>
                    </div>

                    {/* Network */}
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-2 py-1.5">
                        <span className="text-[10px] text-muted-foreground">
                            Network
                        </span>
                        <div className="flex items-center gap-1">
                            <NetworkIcon
                                currency={selectedNetwork?.currency || ""}
                            />
                            <span className="text-[10px] font-semibold text-foreground">
                                {selectedNetwork?.blockchain} (
                                {selectedNetwork?.network})
                            </span>
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="rounded-lg bg-primary/5 px-2 py-2">
                        <p className="text-[10px] text-muted-foreground">
                            Send exactly
                        </p>
                        <div className="mt-0.5 flex items-baseline gap-1">
                            <span className="text-base font-bold text-foreground">
                                {deposit.payment.amount}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground">
                                {data?.currency || "USDT"}
                            </span>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <button
                            type="button"
                            onClick={copyAddress}
                            className="w-full rounded-lg bg-muted/40 px-2 py-1.5 text-left transition active:scale-[0.98] active:bg-muted/60"
                        >
                            <p className="break-all font-mono text-[10px] leading-relaxed text-foreground select-all">
                                {deposit.payment.address}
                            </p>
                        </button>

                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-1 h-7 w-full rounded-lg text-[10px] font-medium"
                            onClick={copyAddress}
                        >
                            {copied ? (
                                <>
                                    <Check className="mr-1 h-3 w-3" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-1 h-3 w-3" />
                                    Copy address
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Notice */}
                    <div className="flex gap-1.5 rounded-lg border border-primary/15 bg-primary/5 px-2 py-1.5">
                        <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <p className="text-[10px] leading-relaxed text-muted-foreground">
                            Send only USDT on {selectedNetwork?.blockchain}.
                            Other networks may be lost.
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-full rounded-lg text-[10px] font-medium text-muted-foreground hover:text-foreground"
                        onClick={() => {
                            setDeposit(null);
                            setAmount("");
                        }}
                    >
                        New deposit
                    </Button>
                </CardContent>
            </Card>
        );
    }

    /* ---------------------------------
       CREATE DEPOSIT
    --------------------------------- */

    return (
        <Card className="w-full border-border/60 shadow-sm rounded-xl overflow-hidden">
            <CardContent className="p-2.5 space-y-2">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 shrink-0">
                        <ArrowDownToLine className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-none">
                        Deposit USDT
                    </p>
                </div>

                {/* Amount Input */}
                <div>
                    <div className="mb-1 flex items-center justify-between">
                        <label className="text-[10px] font-medium text-foreground">
                            Amount
                        </label>
                        <span className="text-[10px] text-muted-foreground">
                            Min 5 USDT
                        </span>
                    </div>

                    <div className="relative">
                        <Input
                            type="number"
                            inputMode="decimal"
                            min="5"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-8 rounded-lg border-border bg-background pr-11 text-xs focus-visible:ring-1 focus-visible:ring-primary/30"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-foreground">
                            {data?.currency || "USDT"}
                        </span>
                    </div>
                </div>

                {/* Network Selection */}
                <div>
                    <label className="mb-1 block text-[10px] font-medium text-foreground">
                        Network
                    </label>

                    <Select
                        value={network}
                        onValueChange={(value) => setNetwork(value)}
                        disabled={isLoadingNetworks}
                    >
                        <SelectTrigger className="h-8 w-full rounded-lg border-border bg-background text-[10px]">
                            <NetworkIcon currency={selectedNetwork?.currency} />

                            <SelectValue placeholder="Select network" />
                        </SelectTrigger>

                        <SelectContent className="rounded-lg">
                            {isLoadingNetworks ? (
                                <div className="flex items-center justify-center p-2">
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                </div>
                            ) : (
                                networks.map((item) => (
                                    <SelectItem
                                        key={item.currency}
                                        value={item.network}
                                        className="py-1.5 px-2 rounded-md"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <NetworkIcon
                                                currency={item.currency}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-medium">
                                                    {item.blockchain}
                                                </span>
                                                <span className="text-[9px] text-muted-foreground">
                                                    {item.network}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                </div>

                {/* Order Summary */}
                <div className="space-y-1 rounded-lg bg-muted/40 px-2 py-1.5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                            Asset
                        </span>
                        <div className="flex items-center gap-1">
                            <NetworkIcon currency="usdt" />
                            <span className="text-[10px] font-semibold">
                                {data?.currency || "USDT"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground">
                            Network
                        </span>
                        <div className="flex items-center gap-1">

                            <NetworkIcon currency={selectedNetwork?.currency} />
                            <span className="text-[10px] font-semibold">
                                {selectedNetwork?.blockchain || network}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/60 pt-1">
                        <span className="text-[10px] text-muted-foreground">
                            Total
                        </span>
                        <span className="text-xs font-bold text-foreground">
                            {amount || "0.00"} {data?.currency || "USDT"}
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <Alert
                        variant="destructive"
                        className="rounded-lg px-2 py-1.5"
                    >
                        <AlertCircle className="h-3 w-3" />
                        <AlertDescription className="text-[10px]">
                            {error}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Submit Button */}
                <Button
                    size="sm"
                    className="h-8 w-full rounded-lg text-[10px] font-semibold active:scale-[0.98] transition"
                    onClick={handleDeposit}
                    disabled={loading || isLoadingNetworks}
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <ArrowDownToLine className="mr-1 h-3 w-3" />
                            Generate address
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}