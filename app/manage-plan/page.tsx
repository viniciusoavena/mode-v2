"use client";

import { useState } from "react";
import { Header } from "@/components/landing/Header";
import { BillingCycleToggle } from "@/components/billing/BillingCycleToggle";
import { PlanCard } from "@/components/billing/PlanCard";

// Dados de exemplo para os planos
const plansData = [
  {
    name: "Hobby",
    description: "For individuals & personal projects.",
    prices: { weekly: '$5', monthly: '$15', yearly: '$150' },
    features: ["1,000 Credits/mo", "Standard generation speed", "All creative modes", "Community support"],
    isCurrent: false,
    isPopular: false,
  },
  {
    name: "Pro",
    description: "For power users and professionals.",
    prices: { weekly: '$10', monthly: '$29', yearly: '$299' },
    features: ["3,000 Credits/mo", "Priority generation queue", "Advanced AI models", "Layer & Vector editor", "Email & chat support"],
    isCurrent: true,
    isPopular: true,
  },
  {
    name: "Team",
    description: "For collaborative organizations.",
    prices: { weekly: '$25', monthly: '$79', yearly: '$799' },
    features: ["10,000 Credits/mo", "Shared assets library", "Team management tools", "API Access", "Dedicated support"],
    isCurrent: false,
    isPopular: false,
  },
];


export default function ManagePlanPage() {
  const [cycle, setCycle] = useState<"weekly" | "monthly" | "yearly">('monthly');

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <Header />
      
      <main className="container mx-auto max-w-7xl py-12 px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient-metallic">Choose Your Plan</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Select the plan that best fits your creative needs. Upgrade, downgrade, or cancel anytime.
          </p>
        </div>

        <BillingCycleToggle cycle={cycle} onCycleChange={setCycle} />
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plansData.map((plan) => (
            <PlanCard key={plan.name} plan={plan} cycle={cycle} />
          ))}
        </div>
      </main>
    </div>
  );
}
