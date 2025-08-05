"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"
import { Copy, Wand2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner" // Importar o toast para notificações

interface DiscoverySidebarProps {
  item: PersonalGalleryItem | null
  onOpenChange: (open: boolean) => void
}

export function DiscoverySidebar({ item, onOpenChange }: DiscoverySidebarProps) {
  const isOpen = !!item;

  const handleCopyPrompt = () => {
    if (item?.prompt) {
      navigator.clipboard.writeText(item.prompt)
      // Feedback visual para o utilizador
      toast.success("Prompt copiado para a área de transferência!")
    }
  }

  // Constrói o URL para o estúdio com os parâmetros da imagem
  const studioLink = item ? `/studio?imageUrl=${encodeURIComponent(item.imageUrl)}&width=${item.settings.width}&height=${item.settings.height}` : "/studio";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[400px] sm:max-w-none flex flex-col p-0">
        {item && (
          <>
            <div className="p-6">
              <SheetHeader>
                <SheetTitle className="text-2xl">{item.title}</SheetTitle>
                <SheetDescription>{item.description}</SheetDescription>
              </SheetHeader>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 pt-0 space-y-6">
                <div className="aspect-square w-full rounded-lg overflow-hidden">
                   <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Prompt</h4>
                  <div className="relative">
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-4 pr-10">
                      {item.prompt}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={handleCopyPrompt}
                      title="Copy Prompt"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Details</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Mode: {item.category}</Badge>
                    <Badge variant="secondary">Type: {item.mode}</Badge>
                    <Badge variant="secondary">Model: {item.model}</Badge>
                  </div>
                </div>
                
                 <div>
                  <h4 className="font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                        <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t bg-background">
                {/* O Botão agora é um Link que leva para o estúdio com os dados da imagem */}
                <Button size="lg" className="w-full" asChild>
                    <Link href={studioLink}>
                        <Wand2 className="w-4 w-4 mr-2" />
                        Use this Image
                    </Link>
                </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}