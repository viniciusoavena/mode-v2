"use client"

import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"

interface GalleryItemCardProps {
  item: PersonalGalleryItem
  onClick: () => void
  className?: string
}

export function GalleryItemCard({ item, onClick, className }: GalleryItemCardProps) {
  return (
    // --- INÍCIO DA CORREÇÃO ---
    // Adicionamos 'aspect-square' para garantir que cada célula da grelha seja um quadrado perfeito.
    <div
      className={cn(
        "aspect-square w-full bg-card rounded-lg overflow-hidden cursor-pointer group relative",
        className
      )}
      onClick={onClick}
    >
    {/* 'object-cover' garante que a imagem preenche o quadrado sem se distorcer. */}
    {/* --- FIM DA CORREÇÃO --- */}
      <img
        src={item.imageUrl || "/placeholder.svg"}
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      {item.isFavorite && (
        <div className="absolute top-3 left-3 bg-red-500/80 text-white rounded-full p-1.5 backdrop-blur-sm">
            <Heart className="h-4 w-4 fill-current" />
        </div>
      )}
    </div>
  )
}