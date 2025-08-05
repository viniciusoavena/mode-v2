"use client"

// Comentar a importação do Stack Auth
// import { useUser } from '@stackframe/stack';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Award } from "lucide-react"
import Link from "next/link"

export function UserBanner() {
  // const user = useUser();

  // Mock user data para desenvolvimento
  const user = {
    displayName: "Alex Johnson",
    primaryEmail: "alex@example.com",
    profileImageUrl: "",
  }

  const initials = user?.displayName?.charAt(0) || "U"

  // Dados de exemplo para os créditos
  const usedCredits = 153
  const totalCredits = 1000
  const creditsPercentage = (usedCredits / totalCredits) * 100

  return (
    <div className="w-full rounded-xl bg-card/50 border border-border p-6 flex flex-col md:flex-row items-center gap-6">
      <Avatar className="h-24 w-24 border-4 border-primary/50">
        <AvatarImage src={user?.profileImageUrl || ""} />
        <AvatarFallback className="text-4xl bg-muted">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1 text-center md:text-left w-full">
        <h2 className="text-2xl font-bold text-gradient-metallic">{user?.displayName || "Alex Johnson"}</h2>
        <p className="text-muted-foreground">{user?.primaryEmail}</p>

        {/* CORREÇÃO: Adicionando a barra de progresso de créditos */}
        <div className="mt-4 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Credits Used</span>
              <span>
                {usedCredits} / {totalCredits}
              </span>
            </div>
            <Progress value={creditsPercentage} className="h-2" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Creations</span>
              <span>42</span>
            </div>
            {/* Pode ser uma barra de progresso para um limite de projetos, ou apenas um número */}
            <Progress value={42} className="h-2 bg-secondary" />
          </div>
        </div>
      </div>

      <Separator orientation="vertical" className="h-auto hidden md:block" />

      <div className="text-center md:text-left">
        <p className="font-bold text-lg text-foreground">Pro Plan</p>
        <p className="text-sm text-muted-foreground">Next renewal: Jul 29, 2025</p>
        <Link href="/manage-plan">
          <Button variant="outline" size="sm" className="mt-4 w-full bg-transparent">
            <Award className="h-4 w-4 mr-2" /> Manage Subscription
          </Button>
        </Link>
      </div>
    </div>
  )
}
