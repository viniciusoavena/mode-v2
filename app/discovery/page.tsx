"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/landing/Header"
import { DiscoveryGrid } from "@/components/discovery/DiscoveryGrid" // Novo componente da grelha
import { DiscoverySidebar } from "@/components/discovery/DiscoverySidebar"
import { mockPersonalGalleryData } from "@/lib/mock-gallery-data"
import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"
import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 18; // Carregar mais itens de cada vez

export default function DiscoveryPage() {
  const [items, setItems] = useState<PersonalGalleryItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PersonalGalleryItem | null>(null);

  // Função para simular o carregamento de mais itens
  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setTimeout(() => {
      const newItems = mockPersonalGalleryData.slice(0, page * ITEMS_PER_PAGE);
      
      if (newItems.length >= mockPersonalGalleryData.length) {
        setHasMore(false);
      }
      
      setItems(newItems);
      setPage(prevPage => prevPage + 1);
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore, page]);

  // Carrega os itens iniciais
  useEffect(() => {
    loadMoreItems();
  }, []);

  // Efeito para detetar o scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 500) {
        return;
      }
      loadMoreItems();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreItems]);


  return (
    <div className="min-h-screen w-full bg-background">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="absolute inset-0 -z-10 h-full w-full pointer-events-none bg-[radial-gradient(circle_farthest-side_at_50%_100%,hsl(var(--secondary)/0.1),transparent)]"></div>

      <Header />

      <main className="container mx-auto max-w-full px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-metallic">Discovery</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            Um mural de inspiração. Explore, descubra e dê o pontapé inicial na sua próxima criação.
          </p>
        </div>

        <DiscoveryGrid items={items} onItemClick={setSelectedItem} />

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
             {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-64 rounded-lg" />
            ))}
          </div>
        )}

        {!hasMore && (
            <p className="text-center text-muted-foreground mt-12">Você chegou ao fim!</p>
        )}
      </main>

      <DiscoverySidebar 
        item={selectedItem}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
          }
        }}
      />
    </div>
  )
}