import { Bell, CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
    const notificationCount = 3;

    return (
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
            <div className="mx-auto flex h-12 max-w-md items-center justify-between px-3">
                {/* Branding */}
                <div className="flex items-center gap-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                        <span className="text-[11px] font-bold text-primary-foreground">
                            E
                        </span>
                    </div>

                    <div className="flex flex-col leading-none">
                        <span className="text-xs font-semibold tracking-tight text-foreground">
                            EtyPto
                        </span>

                        <span className="mt-0.5 text-[7px] font-medium text-muted-foreground">
                            Trade with confidence
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Bell className="h-3.5 w-3.5" />

                        {notificationCount > 0 && (
                            <span className="absolute right-0.5 top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[8px] font-bold leading-none text-destructive-foreground ring-2 ring-background">
                                {notificationCount > 99 ? "99+" : notificationCount}
                            </span>
                        )}
                    </Button>

                    {/* Profile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <CircleUserRound className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

