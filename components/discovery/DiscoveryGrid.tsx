"use client"

import { DiscoveryCard } from "./DiscoveryCard"
import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"

interface DiscoveryGridProps {
  items: PersonalGalleryItem[]
  onItemClick: (item: PersonalGalleryItem) => void 
}

// Função para determinar o "span" de cada item na grelha
const getSpan = (height: number, width: number) => {
  const ratio = height / width;
  if (ratio > 1.4) return "row-span-2"; // Imagens muito altas
  if (ratio > 0.7) return "row-span-1"; // Imagens normais ou largas
  return "row-span-1"; // Padrão
}

export function DiscoveryGrid({ items, onItemClick }: DiscoveryGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-[200px]">
      {items.map((item) => (
        <div key={item.id} className={getSpan(item.settings.height, item.settings.width)}>
            <DiscoveryCard 
                item={item} 
                onClick={() => onItemClick(item)} 
            />
        </div>
      ))}
    </div>
  )
}