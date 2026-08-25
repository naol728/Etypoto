import { Loader2, ShieldCheck } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">
            <div className="flex w-full max-w-[280px] flex-col items-center text-center">
                {/* Brand */}
                <div className="relative mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-primary/10 shadow-sm">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <span className="text-lg font-black tracking-tight">
                                E
                            </span>
                        </div>
                    </div>

                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-primary">
                        <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                    </div>
                </div>

                {/* Branding */}
                <h1 className="text-xl font-bold tracking-tight">
                    Ety<span className="text-primary">Poto</span>
                </h1>

                <p className="mt-1 text-[11px] text-muted-foreground">
                    Secure digital asset platform
                </p>

                {/* Loading */}
                <div className="mt-7 flex flex-col items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />

                    <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                        Loading your wallet...
                    </p>
                </div>

                {/* Bottom status */}
                <div className="mt-6 flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />

                    <span className="text-[9px] text-muted-foreground">
                        Secure connection
                    </span>
                </div>
            </div>
        </div>
    );
}
