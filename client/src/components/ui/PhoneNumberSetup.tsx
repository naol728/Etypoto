import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sharePhone } from "@/api/auth";

interface TelegramWebApp {
    requestContact: (
        callback: (shared: boolean) => void
    ) => void;

    initDataUnsafe?: {
        user?: {
            id: number;
            phone_number?: string;
        };
    };
}

interface Telegram {
    WebApp?: TelegramWebApp;
}

interface TelegramWindow {
    Telegram?: Telegram;
}

interface PhoneNumberSetupProps {
    telegramId: number;
    onComplete: (phone: string) => void;
}

export default function PhoneNumberSetup({
    telegramId,
    onComplete,
}: PhoneNumberSetupProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPhone = (): void => {
        setError(null);

        const telegramWindow =
            window as unknown as TelegramWindow;

        const webApp = telegramWindow.Telegram?.WebApp;

        if (!webApp) {
            setError(
                "Please open this application inside Telegram."
            );
            return;
        }

        setLoading(true);

        webApp.requestContact(
            async (shared: boolean): Promise<void> => {
                if (!shared) {
                    setLoading(false);

                    setError(
                        "You must share your phone number to continue."
                    );
                    return;
                }

                try {
                    const phone =
                        webApp.initDataUnsafe?.user?.phone_number;

                    if (!phone) {
                        throw new Error(
                            "Telegram did not provide your phone number."
                        );
                    }


                    const response = await sharePhone({
                        telegram_id: telegramId,
                        phone,
                    });

                    console.log(
                        "Phone saved:",
                        response
                    );

                    onComplete(phone);
                } catch (error: unknown) {
                    console.error(
                        "Phone error:",
                        error
                    );

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to save phone number."
                    );
                } finally {
                    setLoading(false);
                }
            }
        );
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

                {error && (
                    <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

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