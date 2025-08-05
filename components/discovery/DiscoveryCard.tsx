"use client"

import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"
import { cn } from "@/lib/utils"

interface DiscoveryCardProps {
  item: PersonalGalleryItem
  onClick: () => void
  className?: string
}

export function DiscoveryCard({ item, onClick, className }: DiscoveryCardProps) {
  return (
    <div
      className={cn(
        "w-full h-full bg-card rounded-lg overflow-hidden cursor-pointer group relative",
        className
      )}
      onClick={onClick}
    >
      <img
        src={item.imageUrl || "/placeholder.svg"}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
    </div>
  )
}