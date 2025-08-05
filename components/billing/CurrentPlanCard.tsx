// components/billing/CurrentPlanCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export function CurrentPlanCard() {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>You are currently on the Pro plan. Manage your subscription details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between rounded-lg border border-primary/20 bg-primary/10 p-4">
          <div>
            <h3 className="text-lg font-bold text-gradient-metallic">Pro Plan</h3>
            <p className="text-2xl font-bold text-foreground">$29 <span className="text-sm font-normal text-muted-foreground">/ month</span></p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
             <Award className="h-4 w-4 mr-2" /> Change Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
