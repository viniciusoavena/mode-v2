"use client"

import { GalleryItemCard } from "./GalleryItemCard" 
import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"

interface GalleryGridProps {
  items: PersonalGalleryItem[]
  isPersonal?: boolean
  onItemClick: (item: PersonalGalleryItem) => void 
}

export function GalleryGrid({ items, isPersonal = false, onItemClick }: GalleryGridProps) {
  if (items.length === 0 && isPersonal) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
          <span className="text-4xl">🎨</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Sem criações ainda</h3>
        <p className="text-muted-foreground">
          Comece a criar designs incríveis no estúdio para vê-los aqui.
        </p>
      </div>
    )
  }

  // --- INÍCIO DA CORREÇÃO ---
  // Mudamos de 'columns-*' para 'grid' com 'grid-cols-*'.
  // Isto cria uma grelha previsível e sem espaços horizontais.
  const gridClass = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
  // --- FIM DA CORREÇÃO ---

  return (
    <div className={gridClass}>
      {items.map((item) => (
        // O item do cartão agora ocupará uma célula da grelha.
        <GalleryItemCard 
            key={item.id} 
            item={item} 
            onClick={() => onItemClick(item)} 
        />
      ))}
    </div>
  )
}