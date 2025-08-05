"use client"

import { useState } from "react"
import { Header } from "@/components/landing/Header"
import { GalleryFilters } from "@/components/gallery/GalleryFilters"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"
import { mockPersonalGalleryData } from "@/lib/mock-gallery-data"
import { GallerySidebar } from "@/components/gallery/GallerySidebar"
import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMode, setSelectedMode] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [selectedItem, setSelectedItem] = useState<PersonalGalleryItem | null>(null);

  // ... (a lógica de filtro e ordenação permanece a mesma)
  const filteredData = mockPersonalGalleryData.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory
    const modeMatch = selectedMode === "all" || item.mode === selectedMode
    return categoryMatch && modeMatch
  })

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case "name":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })


  return (
    <div className="min-h-screen w-full bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <Header />

      {/* --- INÍCIO DA CORREÇÃO --- */}
      {/* Aumentamos a largura máxima do container para 'max-w-7xl' */}
      <main className="container mx-auto max-w-7xl px-6 py-12">
      {/* --- FIM DA CORREÇÃO --- */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-metallic">A Minha Galeria</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            A sua coleção pessoal de criações. Organize, gira e revisite a sua jornada criativa.
          </p>
        </div>

        <GalleryFilters
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode="masonry" 
          onViewModeChange={() => {}} 
          totalResults={sortedData.length}
          isPersonal={true}
        />

        <GalleryGrid 
          items={sortedData} 
          isPersonal={true}
          onItemClick={(item) => setSelectedItem(item)}
        />

        <GallerySidebar
            item={selectedItem}
            onOpenChange={(open) => {
                if (!open) {
                    setSelectedItem(null)
                }
            }}
        />
      </main>
    </div>
  )
}