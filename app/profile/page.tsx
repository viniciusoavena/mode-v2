"use client"

import { Header } from "@/components/landing/Header"
import { UserBanner } from "@/components/profile/UserBanner"
import { ProfileSettings } from "@/components/profile/ProfileSettings"

export default function ProfilePage() {
  return (
    <div className="min-h-screen w-full bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <Header />

      <main className="container mx-auto max-w-5xl py-12 px-6">
        <UserBanner />

        <div className="mt-8">
          <ProfileSettings />
        </div>
      </main>
    </div>
  )
}
