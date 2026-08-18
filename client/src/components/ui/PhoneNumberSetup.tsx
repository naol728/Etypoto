/*eslint-disable*/
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sharePhone } from "@/api/auth";

interface PhoneNumberSetupProps {
    telegramId: number;
    onComplete: (phone: string) => void;
}

export default function PhoneNumberSetup({
    telegramId,
    onComplete,
}: PhoneNumberSetupProps) {
    const [loading, setLoading] = useState(false);

    const requestPhone = () => {
        const webApp = (window as any).Telegram?.WebApp;

        if (!webApp) {
            alert("Please open this app inside Telegram.");
            return;
        }

        setLoading(true);

        webApp.requestContact(async (shared: boolean) => {
            if (!shared) {
                setLoading(false);
                return;
            }

            try {

                const response = await fetch("/api/auth/phone");

                const data = await response.json();

                const phone = data.phone;

                if (!phone) {
                    throw new Error("Phone number not received.");
                }

                await sharePhone({
                    telegram_id: telegramId,
                    phone,
                });

                onComplete(phone);
            } catch (error) {
                console.error("Phone error:", error);

                alert(
                    error instanceof Error
                        ? error.message
                        : "Failed to save phone number.",
                );
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold">
                    Phone Number Required
                </h1>

                <p className="mt-2 text-muted-foreground">
                    Share your Telegram phone number to continue.
                </p>

                <Button
                    className="mt-6 w-full"
                    onClick={requestPhone}
                    disabled={loading}
                >
                    {loading
                        ? "Saving..."
                        : "Share Phone Number"}
                </Button>
            </div>
        </div>
    );
}