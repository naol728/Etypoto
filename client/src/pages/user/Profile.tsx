import { useAppSelector } from "@/store/hook";
import {
  User,
  Phone,
  ShieldCheck,
  ChevronRight,
  Copy,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Profile() {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-muted" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  const fullName =
    [user.telegram_first_name, user.telegram_last_name]
      .filter(Boolean)
      .join(" ") || "Telegram User";

  const initials =
    user.telegram_first_name?.charAt(0).toUpperCase() || "U";

  const etbWallet = user.wallets.find(
    (wallet) => wallet.asset === "ETB",
  );

  const usdtWallet = user.wallets.find(
    (wallet) => wallet.asset === "USDT",
  );

  const etbBalance = Number(
    etbWallet?.available_balance ?? 0,
  );

  const usdtBalance = Number(
    usdtWallet?.available_balance ?? 0,
  );

  const getKyc = () => {
    switch (user.kyc_status) {
      case "verified":
        return {
          title: "Identity verified",
          description:
            "Your identity has been successfully verified.",
          icon: CheckCircle2,
          className:
            "bg-emerald-500/10 text-emerald-600",
        };

      case "rejected":
        return {
          title: "Verification rejected",
          description:
            "Your verification was rejected. Please try again.",
          icon: XCircle,
          className: "bg-red-500/10 text-red-600",
        };

      default:
        return {
          title: "Verification required",
          description:
            "Complete identity verification to unlock all features.",
          icon: Clock,
          className:
            "bg-amber-500/10 text-amber-600",
        };
    }
  };

  const kyc = getKyc();
  const KycIcon = kyc.icon;

  const copyTelegramId = async () => {
    try {
      await navigator.clipboard.writeText(
        String(user.telegram_id),
      );

      toast.success("Telegram ID copied");
    } catch {
      toast.error("Unable to copy");
    }
  };

  const formatBalance = (
    value: number,
    decimals = 2,
  ) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-28 pt-5">

      {/* =========================================
          HEADER
      ========================================== */}
      <div className="mb-5">
        <p className="text-sm text-muted-foreground">
          Account
        </p>

        <h1 className="text-2xl font-bold tracking-tight">
          Profile
        </h1>
      </div>

      {/* =========================================
          USER HEADER
      ========================================== */}
      <div className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />

        <div className="relative p-5">

          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg">
                {initials}
              </div>

              {user.status === "active" && (
                <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-background bg-emerald-500 p-1">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
              )}
            </div>

            {/* User */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-lg font-bold">
                  {fullName}
                </h2>

                {user.kyc_status === "verified" && (
                  <BadgeCheck className="h-4 w-4 shrink-0 text-primary" />
                )}
              </div>

              {user.telegram_username && (
                <p className="truncate text-sm text-muted-foreground">
                  @{user.telegram_username}
                </p>
              )}

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium capitalize text-emerald-600">
                  {user.status}
                </span>

                <span className="text-xs text-muted-foreground">
                  Member
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          WALLET OVERVIEW
      ========================================== */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Wallet overview
          </h2>

          <Wallet className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-sm">

          {/* Total */}
          <div>
            <p className="text-xs text-muted-foreground">
              Total assets
            </p>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-bold tracking-tight">
                {formatBalance(etbBalance)}
              </span>

              <span className="mb-1 text-sm text-muted-foreground">
                ETB
              </span>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Wallets */}
          <div className="grid grid-cols-2 gap-3">

            {/* ETB */}
            <div className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  ETB
                </span>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <ArrowDownLeft className="h-3.5 w-3.5 text-primary" />
                </div>
              </div>

              <p className="mt-3 text-lg font-bold">
                {formatBalance(etbBalance)}
              </p>

              <p className="text-[11px] text-muted-foreground">
                Available balance
              </p>

              {Number(etbWallet?.locked_balance ?? 0) > 0 && (
                <p className="mt-2 text-[10px] text-amber-600">
                  Locked:{" "}
                  {formatBalance(
                    Number(etbWallet?.locked_balance ?? 0),
                  )}
                </p>
              )}
            </div>

            {/* USDT */}
            <div className="rounded-2xl bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  USDT
                </span>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>

              <p className="mt-3 text-lg font-bold">
                {formatBalance(usdtBalance, 8)}
              </p>

              <p className="text-[11px] text-muted-foreground">
                Available balance
              </p>

              {Number(usdtWallet?.locked_balance ?? 0) > 0 && (
                <p className="mt-2 text-[10px] text-amber-600">
                  Locked:{" "}
                  {formatBalance(
                    Number(usdtWallet?.locked_balance ?? 0),
                    8,
                  )}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* =========================================
          KYC
      ========================================== */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">
          Identity verification
        </h2>

        <button
          type="button"
          onClick={() => {
            // navigate("/kyc")
          }}
          className="group flex w-full items-center gap-4 rounded-3xl border bg-card p-4 text-left shadow-sm transition hover:border-primary/30 hover:bg-muted/30 active:scale-[0.99]"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${kyc.className}`}
          >
            <KycIcon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {kyc.title}
              </p>
            </div>

            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              {kyc.description}
            </p>
          </div>

          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* =========================================
          ACCOUNT DETAILS
      ========================================== */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold">
          Account details
        </h2>

        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">

          {/* Name */}
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">
                Full name
              </p>

              <p className="truncate text-sm font-medium">
                {fullName}
              </p>
            </div>
          </div>

          <Separator />

          {/* Phone */}
          <div className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
              <Phone className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">
                Phone number
              </p>

              <p className="text-sm font-medium">
                {user.phone || "Not provided"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Telegram */}
          <button
            type="button"
            onClick={copyTelegramId}
            className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-muted/30"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <span className="text-xs font-bold text-blue-600">
                TG
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">
                Telegram ID
              </p>

              <p className="truncate font-mono text-sm">
                {user.telegram_id}
              </p>
            </div>

            <Copy className="h-4 w-4 text-muted-foreground" />
          </button>

        </div>
      </div>

      {/* =========================================
          KYC DETAILS
      ========================================== */}
      {(user.kyc_status === "verified" ||
        user.veritas_user_id ||
        user.kyc_verified_at) && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold">
            Verification details
          </h2>

          <div className="rounded-3xl border bg-card p-4 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Identity verification
                </p>

                <p className="text-xs capitalize text-muted-foreground">
                  Status: {user.kyc_status}
                </p>
              </div>
            </div>

            {user.veritas_user_id && (
              <>
                <Separator className="my-4" />

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Verification ID
                  </p>

                  <p className="mt-1 truncate font-mono text-xs">
                    {user.veritas_user_id}
                  </p>
                </div>
              </>
            )}

            {user.kyc_verified_at && (
              <>
                <Separator className="my-4" />

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />

                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      Verified on
                    </p>

                    <p className="text-xs font-medium">
                      {new Date(
                        user.kyc_verified_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          LOGOUT
      ========================================== */}
      <Button
        variant="outline"
        className="mt-8 w-full rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => {
          // dispatch(logout())
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>

      {/* Small footer */}
      <p className="mt-5 text-center text-[10px] text-muted-foreground/60">
        Account ID: {user.id.slice(0, 8)}...
      </p>
    </div>
  );
}