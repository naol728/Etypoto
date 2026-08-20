import { useAppSelector } from "@/store/hook";
import {
  User,
  Phone,
  ShieldCheck,
  ChevronRight,
  Copy,
  Clock,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getKycStatus } from "@/api/kyc";
import { useQuery } from "@tanstack/react-query";

// =============================================
// TYPES
// =============================================
type KycStatus = "pending" | "verified" | "rejected" | "none";

interface KycConfig {
  title: string;
  description: string;
  className: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// =============================================
// CONSTANTS
// =============================================
const KYC_CONFIGS: Record<KycStatus, KycConfig> = {
  pending: {
    title: "Verification under review",
    description: "Your identity documents are being reviewed by our verification team.",
    className: "bg-amber-500/10 text-amber-500",
  },
  verified: {
    title: "Identity verified",
    description: "Your identity has been successfully verified.",
    className: "bg-green-500/10 text-green-500",
  },
  rejected: {
    title: "Verification rejected",
    description: "Your KYC was rejected. Tap here to review and submit again.",
    className: "bg-destructive/10 text-destructive",
  },
  none: {
    title: "Verify your identity",
    description: "Complete identity verification to unlock all wallet features.",
    className: "bg-primary/10 text-primary",
  },
};

// =============================================
// HELPER FUNCTIONS
// =============================================
const getInitials = (firstName?: string): string => {
  return firstName?.charAt(0).toUpperCase() || "U";
};

const getFullName = (firstName?: string, lastName?: string): string => {
  return [firstName, lastName].filter(Boolean).join(" ") || "Telegram User";
};

const formatBalance = (value: number, decimals: number = 2): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const getKycStatuss = (status?: KycStatus): KycConfig => {
  return status ? KYC_CONFIGS[status] : KYC_CONFIGS.none;
};

// =============================================
// SUB-COMPONENTS
// =============================================
const LoadingState: React.FC = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-muted" />
      <p className="mt-4 text-sm text-muted-foreground">Loading profile...</p>
    </div>
  </div>
);

interface UserAvatarProps {
  initials: string;
  isActive: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ initials, isActive }) => (
  <div className="relative shrink-0">
    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-primary text-lg sm:text-xl font-bold text-primary-foreground shadow-lg">
      {initials}
    </div>
    {isActive && (
      <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background bg-emerald-500 p-0.5">
        <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
      </div>
    )}
  </div>
);

interface KycCardProps {
  status: KycStatus;
  isLocked: boolean;
  onNavigate: () => void;
}

const KycCard: React.FC<KycCardProps> = ({ status, isLocked, onNavigate }) => {
  const kyc = getKycStatuss(status);
  const KycIcon = kyc.icon || Clock;

  return (
    <button
      type="button"
      disabled={isLocked}
      onClick={onNavigate}
      className={`group flex w-full items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border bg-card p-3 sm:p-4 text-left shadow-sm transition-all active:scale-[0.98] ${isLocked
        ? "cursor-default opacity-90"
        : "hover:border-primary/30 hover:bg-muted/30 active:scale-[0.98]"
        }`}
    >
      <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${kyc.className}`}>
        <KycIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm sm:text-base font-semibold">{kyc.title}</p>
        <p className="mt-0.5 text-[10px] sm:text-xs leading-4 sm:leading-5 text-muted-foreground">
          {kyc.description}
        </p>
      </div>
      {!isLocked && (
        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      )}
    </button>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  onClick?: () => void;
  iconClassName?: string;
  isLast?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  onClick,
  iconClassName = "bg-primary/10",
  isLast = false,
}) => {
  const Wrapper = onClick ? "button" : "div";
  const wrapperProps = onClick
    ? {
      type: "button" as const,
      onClick,
      className: "flex w-full items-center gap-3 p-3 sm:p-4 text-left transition active:bg-muted/30 hover:bg-muted/20"
    }
    : { className: "flex items-center gap-3 p-3 sm:p-4" };

  return (
    <>
      <Wrapper {...wrapperProps}>
        <div className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-[11px] text-muted-foreground">{label}</p>
          <p className="text-xs sm:text-sm font-medium truncate">{value}</p>
        </div>
        {onClick && <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />}
      </Wrapper>
      {!isLast && <Separator />}
    </>
  );
};

// =============================================
// MAIN COMPONENT
// =============================================
export default function Profile() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth?.user);
  const { data: kycResult } = useQuery({
    queryKey: ["kyc-status"],
    queryFn: getKycStatus,
  });



  // Early return for loading state
  if (!user) {
    return <LoadingState />;
  }

  // Derived state
  const fullName = getFullName(user?.telegram_first_name ?? undefined, user?.telegram_last_name ?? undefined);
  const initials = getInitials(user?.telegram_first_name ?? undefined);
  const kycStatus = (kycResult?.status ?? "none") as KycStatus;
  const isKycLocked = kycStatus === "verified";

  // Wallet balances
  const etbWallet = user.wallets.find((w) => w.asset === "ETB");
  const usdtWallet = user.wallets.find((w) => w.asset === "USDT");
  const etbBalance = Number(etbWallet?.available_balance ?? 0);
  const usdtBalance = Number(usdtWallet?.available_balance ?? 0);

  // Handlers
  const handleCopyTelegramId = async () => {
    try {
      await navigator.clipboard.writeText(String(user.telegram_id));
      toast.success("Telegram ID copied", {
        duration: 2000,
        position: "bottom-center",
      });
    } catch {
      toast.error("Unable to copy", {
        duration: 2000,
        position: "bottom-center",
      });
    }
  };

  const handleKycNavigate = () => {
    if (!isKycLocked) {
      navigate("/kyc");
    }
  };



  // =============================================
  // RENDER
  // =============================================
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-lg px-3 sm:px-4 pb-20 sm:pb-28 pt-4 sm:pt-5">

        {/* USER CARD */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-card shadow-sm">
          <div className="absolute inset-x-0 top-0 h-20 sm:h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
          <div className="relative p-4 sm:p-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <UserAvatar initials={initials} isActive={user.status === "active"} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="truncate text-base sm:text-lg font-bold">{fullName}</h2>
                  {user.kyc_status === "verified" && (
                    <BadgeCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-primary" />
                  )}
                </div>

                {user.telegram_username && (
                  <p className="truncate text-xs sm:text-sm text-muted-foreground">
                    @{user.telegram_username}
                  </p>
                )}

                <div className="mt-1.5 sm:mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium capitalize text-emerald-600">
                    {user.status}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BALANCES */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
          <div className="rounded-2xl sm:rounded-3xl border bg-card p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-sm bg-emerald-500/10">
                <span className="text-xs sm:text-sm font-bold text-emerald-600">ETB</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">ETB Balance</p>
                <p className="text-base sm:text-lg font-bold truncate">{formatBalance(etbBalance)} ETB</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl sm:rounded-3xl border bg-card p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-8 sm:w-8 items-center justify-center rounded-sm bg-blue-500/10">
                <span className="text-xs sm:text-sm font-bold text-blue-600">USDT</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-[11px] text-muted-foreground">USDT Balance</p>
                <p className="text-base sm:text-lg font-bold truncate">{formatBalance(usdtBalance)} USDT</p>
              </div>
            </div>
          </div>
        </div>

        {/* KYC CARD */}
        <div className="mt-4 sm:mt-6">
          <h2 className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold">Identity verification</h2>
          <KycCard status={kycStatus} isLocked={isKycLocked} onNavigate={handleKycNavigate} />
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="mt-4 sm:mt-6">
          <h2 className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold">Account details</h2>
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl border bg-card shadow-sm">
            <DetailItem
              icon={<User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />}
              label="Full name"
              value={fullName}
              iconClassName="bg-primary/10"
            />
            <DetailItem
              icon={<Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />}
              label="Phone number"
              value={user.phone || "Not provided"}
              iconClassName="bg-emerald-500/10"
            />
            <DetailItem
              icon={<span className="text-[10px] sm:text-xs font-bold text-blue-600">TG</span>}
              label="Telegram ID"
              value={user.telegram_id}
              onClick={handleCopyTelegramId}
              iconClassName="bg-blue-500/10"
            />

          </div>
        </div>

        {/* VERIFICATION DETAILS (conditional) */}
        {(user.kyc_status === "verified" || user.veritas_user_id || user.kyc_verified_at) && (
          <div className="mt-4 sm:mt-6">
            <h2 className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-semibold">Verification details</h2>
            <div className="rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary/10">
                  <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-semibold">Identity verification</p>
                  <p className="text-[10px] sm:text-xs capitalize text-muted-foreground">
                    Status: {user.kyc_status}
                  </p>
                </div>
              </div>

              {user.veritas_user_id && (
                <>
                  <Separator className="my-3 sm:my-4" />
                  <div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground">Verification ID</p>
                    <p className="mt-1 truncate font-mono text-[10px] sm:text-xs">{user.veritas_user_id}</p>
                  </div>
                </>
              )}

              {user.kyc_verified_at && (
                <>
                  <Separator className="my-3 sm:my-4" />
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground">Verified on</p>
                      <p className="text-[10px] sm:text-xs font-medium truncate">
                        {new Date(user.kyc_verified_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <p className="mt-4 sm:mt-5 text-center text-[9px] sm:text-[10px] text-muted-foreground/60">
          Account ID: {user.id.slice(0, 8)}...
        </p>
      </div>
    </div>
  );
}