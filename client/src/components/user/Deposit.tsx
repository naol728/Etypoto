import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import EtbDeposit from "./EtbDeposit";
import UsdtDeposit from "./UsdtDeposit";

export default function Deposit() {
    return (
        <div className="w-full">
            <div className="mb-4">
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    Deposit
                </h1>

                <p className="mt-1 text-xs text-muted-foreground">
                    Choose how you want to fund your wallet.
                </p>
            </div>

            <Tabs defaultValue="crypto" className="w-full">
                <TabsList className="grid h-9 w-full grid-cols-2 rounded-lg bg-muted p-1">
                    <TabsTrigger
                        value="crypto"
                        className="rounded-md text-xs"
                    >
                        Crypto
                    </TabsTrigger>

                    <TabsTrigger
                        value="etb"
                        className="rounded-md text-xs"
                    >
                        ETB
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="crypto" className="mt-4">
                    <UsdtDeposit />
                </TabsContent>

                <TabsContent value="etb" className="mt-4">
                    <EtbDeposit />
                </TabsContent>
            </Tabs>
        </div>
    );
}