// app/billing/page.tsx
import { Header } from "@/components/landing/Header";
import { UserBanner } from "@/components/profile/UserBanner";
import { CurrentPlanCard } from "@/components/billing/CurrentPlanCard";
import { PaymentMethodCard } from "@/components/billing/PaymentMethodCard";
import { BillingHistoryTable } from "@/components/billing/BillingHistoryTable";

export default function BillingPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <Header />
      
      <main className="container mx-auto max-w-5xl py-12 px-6">
        <UserBanner />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CurrentPlanCard />
            <BillingHistoryTable />
          </div>
          <div className="lg:col-span-1">
            <PaymentMethodCard />
          </div>
        </div>
      </main>
    </div>
  );
}
