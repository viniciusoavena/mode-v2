"use client"

import { useState } from "react"
import { useStudioStore } from "@/store/studio-store"
import type { Quality } from "@/store/slices/generation-slice"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ChevronDown, Check, Zap, ImageIcon, Shapes, Paperclip } from "lucide-react"

const models = [
  { id: "low", name: "Mode 1.0 Low", credits: 1 },
  { id: "med", name: "Mode 1.0 Med", credits: 3 },
  { id: "high", name: "Mode 1.0 High", credits: 5 },
]

export function PromptBar() {
  const {
    prompt,
    setPrompt,
    isGenerating,
    generateImage,
    creativeMode,
    // CORREÇÃO: Usar 'resourceType' em vez do 'selectedContext' inexistente.
    resourceType,
    quality,
    setQuality,
  } = useStudioStore()

  const [creationType, setCreationType] = useState("image")

  const handleGenerateClick = () => {
    // CORREÇÃO: A verificação agora usa 'resourceType'.
    if (!prompt || !creativeMode || !resourceType) return
    
    generateImage({
      prompt,
      mode: creativeMode,
      context: resourceType, // Passa o 'resourceType' como 'context'.
      quality,
    })
  }

  const selectedModel = models.find((m) => m.id === quality) || models[1]

  return (
    <div className="w-full max-w-4xl flex-shrink-0 p-4 space-y-3">
      <div className="relative">
        <Button variant="ghost" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Paperclip className="h-5 w-5" />
        </Button>
        <Textarea
          // CORREÇÃO: O placeholder também é atualizado para usar 'resourceType'.
          placeholder={`Create ${resourceType?.toLowerCase() || "content"}...`}
          className="w-full rounded-lg border bg-card/80 p-4 pl-12 pr-24 shadow-lg resize-none backdrop-blur-xl min-h-[56px]"
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Button
            size="icon"
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 w-9"
            onClick={handleGenerateClick}
            disabled={isGenerating || !prompt}
          >
            {isGenerating ? (
              <div className="h-5 w-5 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <ArrowUp className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <ToggleGroup
          type="single"
          value={creationType}
          onValueChange={(value) => value && setCreationType(value)}
          className="rounded-full bg-background p-1"
        >
          <ToggleGroupItem
            value="image"
            aria-label="Create Image"
            className="rounded-full px-3 text-xs sm:text-sm data-[state=on]:bg-accent"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Imagem
          </ToggleGroupItem>
          <ToggleGroupItem
            value="layer"
            aria-label="Create Layer"
            className="rounded-full px-3 text-xs sm:text-sm data-[state=on]:bg-accent"
          >
            <Shapes className="h-4 w-4 mr-2" /> Layer
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-2">
          {/* CORREÇÃO: Exibe 'resourceType' no badge. */}
          {creativeMode && resourceType && (
            <Badge variant="outline" className="text-xs">
              {creativeMode} • {resourceType}
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                {selectedModel.name}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 glass-card bg-card border-border">
              {models.map((model) => (
                <DropdownMenuItem key={model.id} onSelect={() => setQuality(model.id as Quality)}>
                  <div className="flex justify-between items-center w-full">
                    <p className="font-medium">{model.name}</p>
                    <div className="flex items-center gap-2 pl-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-primary" /> {model.credits}
                      </Badge>
                      {selectedModel.id === model.id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}