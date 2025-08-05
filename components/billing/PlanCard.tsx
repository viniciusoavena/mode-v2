"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: {
    name: string;
    description: string;
    prices: {
      weekly: string;
      monthly: string;
      yearly: string;
    };
    features: string[];
    isCurrent?: boolean;
    isPopular?: boolean;
  };
  cycle: "weekly" | "monthly" | "yearly";
}

export function PlanCard({ plan, cycle }: PlanCardProps) {
  const price = plan.prices[cycle];
  const cycleText = cycle === 'weekly' ? '/wk' : cycle === 'monthly' ? '/mo' : '/yr';

  return (
    <Card className={`relative flex flex-col h-full border-2 ${plan.isCurrent ? 'border-primary' : 'border-border'} bg-card/50`}>
      {plan.isPopular && <Badge className="absolute top-4 right-4">Most Popular</Badge>}
      <CardHeader>
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <span className="text-4xl font-bold">{price}</span>
            <span className="text-muted-foreground">{cycleText}</span>
          </div>
          <ul className="space-y-3">
            {plan.features.map((feature: string) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button 
          className={`w-full mt-8 ${plan.isCurrent ? '' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
          variant={plan.isCurrent ? 'outline' : 'default'}
          disabled={plan.isCurrent}
        >
          {plan.isCurrent ? "Current Plan" : "Choose Plan"}
        </Button>
      </CardContent>
    </Card>
  );
}
