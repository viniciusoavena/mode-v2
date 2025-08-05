"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface BillingCycleToggleProps {
  cycle: "weekly" | "monthly" | "yearly";
  onCycleChange: (cycle: "weekly" | "monthly" | "yearly") => void;
}

export function BillingCycleToggle({ cycle, onCycleChange }: BillingCycleToggleProps) {
  return (
    <div className="flex justify-center">
      <ToggleGroup 
        type="single" 
        value={cycle}
        onValueChange={(value: "weekly" | "monthly" | "yearly") => value && onCycleChange(value)}
        className="rounded-full bg-card/80 p-1 border border-border"
      >
        <ToggleGroupItem value="weekly" aria-label="Toggle weekly" className="rounded-full px-6 data-[state=on]:bg-accent">
          Weekly
        </ToggleGroupItem>
        <ToggleGroupItem value="monthly" aria-label="Toggle monthly" className="rounded-full px-6 data-[state=on]:bg-accent">
          Monthly
        </ToggleGroupItem>
        <ToggleGroupItem value="yearly" aria-label="Toggle yearly" className="rounded-full px-6 data-[state=on]:bg-accent">
          Yearly
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
