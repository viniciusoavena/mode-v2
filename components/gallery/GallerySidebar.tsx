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
import { Copy, Edit, Trash2, Wand2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface GallerySidebarProps {
  item: PersonalGalleryItem | null
  onOpenChange: (open: boolean) => void
}

export function GallerySidebar({ item, onOpenChange }: GallerySidebarProps) {
  const isOpen = !!item;

  const handleCopyPrompt = () => {
    if (item?.prompt) {
      navigator.clipboard.writeText(item.prompt)
      toast.success("Prompt copiado!")
    }
  }

  const handleDelete = () => {
    // Lógica para apagar o item seria implementada aqui
    toast.error(`${item?.title} foi apagado.`)
    onOpenChange(false)
  }

  // Constrói o URL para o estúdio com os dados da imagem
  const studioLink = item ? `/studio?imageUrl=${encodeURIComponent(item.imageUrl)}&width=${item.settings.width}&height=${item.settings.height}` : "/studio";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:w-[400px] sm:max_w-none flex flex-col p-0">
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
                  <h4 className="font-semibold mb-2">Detalhes Técnicos</h4>
                   <p className="text-sm text-muted-foreground">
                    {item.settings.width}×{item.settings.height} • {item.settings.steps} steps • Seed: {item.settings.seed}
                  </p>
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
            
            <div className="p-6 border-t bg-background grid grid-cols-2 gap-3">
                <Button size="lg" variant="outline">
                    <Edit className="w-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button size="lg" className="w-full" asChild>
                    <Link href={studioLink}>
                        <Wand2 className="w-4 w-4 mr-2" />
                        Usar Imagem
                    </Link>
                </Button>
                 <Button size="lg" variant="destructive" className="col-span-2" onClick={handleDelete}>
                    <Trash2 className="w-4 w-4 mr-2" />
                    Apagar
                </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}