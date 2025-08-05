// components/billing/PaymentMethodCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export function PaymentMethodCard() {
    return (
        <Card className="bg-card/50 border-border">
            <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Update your billing details and address.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-start gap-4">
                    <CreditCard className="h-8 w-8 mt-1 text-muted-foreground" />
                    <div>
                        <p className="font-semibold text-foreground">Visa ending in 1234</p>
                        <p className="text-sm text-muted-foreground">Expires 06/2027</p>
                        <Button variant="secondary" size="sm" className="mt-4">Update Payment Method</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
