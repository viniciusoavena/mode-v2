"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, MagnetIcon as Magic } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { AuthButton } from "@/components/auth/auth-button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-secondary to-primary">
            <Magic className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">Mode</span>
        </Link>
        <div className="ml-auto flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {/* NOVO LINK ADICIONADO */}
            <Link href="/discovery" className="hover:underline underline-offset-4">
              Discovery
            </Link>
            <Link href="/pricing" className="hover:underline underline-offset-4">
              Pricing
            </Link>
            <Link href="/docs" className="hover:underline underline-offset-4">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:inline-flex rounded-full text-muted-foreground hover:text-foreground"
            >
              <Link href="/studio">Studio</Link>
            </Button>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
              <Link href="/studio">Get Started</Link>
            </Button>
            <AuthButton />
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-4">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-3/4 md:w-2/5">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Explore the site and discover new opportunities.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
               {/* NOVO LINK ADICIONADO (MOBILE) */}
              <Link href="/discovery" className="hover:underline underline-offset-4">
                Discovery
              </Link>
              <Link href="/pricing" className="hover:underline underline-offset-4">
                Pricing
              </Link>
              <Link href="/docs" className="hover:underline underline-offset-4">
                Docs
              </Link>
              <Link href="/studio" className="hover:underline underline-offset-4">
                Studio
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}