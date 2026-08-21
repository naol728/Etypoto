import { useState } from "react";
import {
    ArrowDownToLine,
    Check,
    Copy,
    Loader2,
    ShieldCheck,
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

import { Alert, AlertDescription } from "@/components/ui/alert";

import {
    depositWallet,
    type CreateUsdtDepositResponse,
} from "@/api/wallet";

const NETWORKS = [
    {
        value: "TRC20",
        label: "TRON",
        description: "TRC20",
    },
    {
        value: "ERC20",
        label: "Ethereum",
        description: "ERC20",
    },
    {
        value: "BEP20",
        label: "BNB Chain",
        description: "BEP20",
    },
] as const;

type Network = (typeof NETWORKS)[number]["value"];

export default function UsdtDeposit() {
    const [amount, setAmount] = useState("");
    const [network, setNetwork] = useState<Network>("TRC20");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [deposit, setDeposit] =
        useState<CreateUsdtDepositResponse | null>(null);

    const [copied, setCopied] = useState(false);

    const selectedNetwork = NETWORKS.find(
        (item) => item.value === network
    );

    const handleDeposit = async () => {
        setError(null);

        const numericAmount = Number(amount);

        if (!amount || Number.isNaN(numericAmount)) {
            setError("Enter a valid amount.");
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

        await navigator.clipboard.writeText(
            deposit.payment.address
        );

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    /* ---------------------------------
       DEPOSIT ADDRESS
    --------------------------------- */

    if (deposit) {
        return (
            <div className="w-full space-y-2 px-1 pb-2">

                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                        <ArrowDownToLine className="h-3.5 w-3.5 text-primary" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-foreground">
                            Deposit USDT
                        </p>

                        <p className="text-[8px] text-muted-foreground">
                            Send USDT to this address
                        </p>
                    </div>
                </div>

                {/* Network */}
                <div className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5">
                    <span className="text-[9px] text-muted-foreground">
                        Network
                    </span>

                    <span className="text-[9px] font-semibold text-foreground">
                        {selectedNetwork?.label} ({selectedNetwork?.description})
                    </span>
                </div>

                {/* Amount */}
                <div className="rounded-lg border border-border bg-card px-2.5 py-2">
                    <p className="text-[8px] text-muted-foreground">
                        Send exactly
                    </p>

                    <div className="mt-0.5 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground">
                            {deposit.payment.amount}
                        </span>

                        <span className="text-[9px] font-semibold text-muted-foreground">
                            USDT
                        </span>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <p className="mb-1 text-[8px] text-muted-foreground">
                        Deposit address
                    </p>

                    <div className="rounded-lg border border-border bg-muted/30 p-2">
                        <p className="break-all font-mono text-[8px] leading-3.5 text-foreground">
                            {deposit.payment.address}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="mt-1.5 h-7 w-full rounded-lg text-[9px]"
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
                                Copy Address
                            </>
                        )}
                    </Button>
                </div>

                {/* Warning */}
                <div className="flex gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
                    <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />

                    <p className="text-[8px] leading-3.5 text-muted-foreground">
                        Send only USDT using the selected network.
                        Sending another network may result in loss of funds.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="h-7 w-full rounded-lg text-[9px]"
                    onClick={() => {
                        setDeposit(null);
                        setAmount("");
                    }}
                >
                    New Deposit
                </Button>
            </div>
        );
    }

    /* ---------------------------------
       CREATE DEPOSIT
    --------------------------------- */

    return (
        <div className="w-full space-y-2 px-1">

            {/* Header */}
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                    <ArrowDownToLine className="h-3.5 w-3.5 text-primary" />
                </div>

                <div>
                    <p className="text-xs font-semibold text-foreground">
                        Deposit USDT
                    </p>

                    <p className="text-[8px] text-muted-foreground">
                        Add USDT to your wallet
                    </p>
                </div>
            </div>

            {/* Amount */}
            <div>
                <div className="mb-1 flex items-center justify-between">
                    <label className="text-[9px] font-medium text-foreground">
                        Amount
                    </label>

                    <span className="text-[8px] text-muted-foreground">
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
                        className="h-8 rounded-lg border-border bg-background pr-12 text-xs"
                    />

                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] font-bold text-muted-foreground">
                        USDT
                    </span>
                </div>
            </div>

            {/* Network */}
            <div>
                <label className="mb-1 block text-[9px] font-medium text-foreground">
                    Network
                </label>

                <Select
                    value={network}
                    onValueChange={(value) =>
                        setNetwork(value as Network)
                    }
                >
                    <SelectTrigger className="h-8 rounded-lg border-border bg-background text-[9px]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {NETWORKS.map((item) => (
                            <SelectItem
                                key={item.value}
                                value={item.value}
                                className="text-[10px]"
                            >
                                {item.label} ({item.description})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                <div className="flex justify-between">
                    <span className="text-[8px] text-muted-foreground">
                        Asset
                    </span>

                    <span className="text-[8px] font-semibold">
                        USDT
                    </span>
                </div>

                <div className="mt-1 flex justify-between">
                    <span className="text-[8px] text-muted-foreground">
                        Network
                    </span>

                    <span className="text-[8px] font-semibold">
                        {selectedNetwork?.label}
                    </span>
                </div>

                <div className="mt-1 flex justify-between">
                    <span className="text-[8px] text-muted-foreground">
                        Amount
                    </span>

                    <span className="text-[8px] font-semibold">
                        {amount || "0"} USDT
                    </span>
                </div>
            </div>

            {/* Error */}
            {error && (
                <Alert
                    variant="destructive"
                    className="rounded-lg px-2 py-1.5"
                >
                    <AlertDescription className="text-[8px]">
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Submit */}
            <Button
                className="h-8 w-full rounded-lg text-[10px] font-semibold"
                onClick={handleDeposit}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <ArrowDownToLine className="mr-1 h-3 w-3" />
                        Generate Address
                    </>
                )}
            </Button>

            {/* Tiny warning */}
            <div className="flex items-center gap-1.5 px-1">
                <ShieldCheck className="h-3 w-3 shrink-0 text-primary" />

                <p className="text-[8px] leading-3 text-muted-foreground">
                    Make sure the selected network matches your sending
                    wallet.
                </p>
            </div>
        </div>
    );
}