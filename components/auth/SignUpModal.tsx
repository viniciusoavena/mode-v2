"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { MagnetIcon as Magic, Sparkles } from "lucide-react"
import Link from "next/link"

interface SignUpModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function SignUpModal({ isOpen, onOpenChange }: SignUpModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/80 backdrop-blur-xl border-border text-foreground">
        <DialogHeader className="text-center items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-secondary to-primary mb-4">
                <Sparkles className="h-6 w-6 text-white" />
            </div>
          <DialogTitle className="text-2xl">Desbloqueie todo o seu potencial criativo</DialogTitle>
          <DialogDescription className="max-w-sm mx-auto pt-2">
            Registe-se gratuitamente para guardar esta criação, editar em detalhe e aceder a todas as ferramentas de IA.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:gap-2">
          <Button size="lg" asChild>
            <Link href="/auth/signup">Criar Conta Gratuita</Link>
          </Button>
           <Button size="lg" variant="ghost" asChild>
            <Link href="/auth/signin">Já tenho uma conta</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}