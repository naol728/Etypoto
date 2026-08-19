import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-md items-center justify-between px-4">
                {/* Branding */}
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                        <span className="text-sm font-bold text-primary-foreground">
                            E
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-base font-bold tracking-tight">
                            EtyPoto
                        </span>

                        <span className="text-[10px] text-muted-foreground">
                            Trade with confidence
                        </span>
                    </div>
                </div>

                {/* Wallet */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                >
                    <Wallet className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}