"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
    ChevronDown, 
    Target, 
    AlignHorizontalJustifyStart, 
    AlignHorizontalJustifyCenter, 
    AlignHorizontalJustifyEnd, 
    AlignVerticalJustifyStart, 
    AlignVerticalJustifyCenter, 
    AlignVerticalJustifyEnd,
    AlignHorizontalSpaceAround,
    AlignVerticalSpaceAround
} from "lucide-react"
import { useState } from "react"
import { useStudioStore } from "@/store/studio-store"
import type { Layer } from "@/app/types/layer-types"

export function LayoutToolsSection() {
  const { layers, selectedLayerIds, updateLayer } = useStudioStore()
  const [isOpen, setIsOpen] = useState(true)

  const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id))
  const hasMultipleSelection = selectedLayers.length > 1

  const handleAlignLayers = (alignment: "align-left" | "align-center-horizontal" | "align-right" | "align-top" | "align-center-vertical" | "align-bottom") => {
    if (selectedLayers.length < 2) return

    const bounds = selectedLayers.reduce(
      (acc, layer) => ({
        left: Math.min(acc.left, layer.x),
        right: Math.max(acc.right, layer.x + layer.width),
        top: Math.min(acc.top, layer.y),
        bottom: Math.max(acc.bottom, layer.y + layer.height),
      }),
      {
        left: Number.POSITIVE_INFINITY,
        right: Number.NEGATIVE_INFINITY,
        top: Number.POSITIVE_INFINITY,
        bottom: Number.NEGATIVE_INFINITY,
      },
    )

    const centerX = (bounds.left + bounds.right) / 2
    const centerY = (bounds.top + bounds.bottom) / 2

    selectedLayers.forEach((layer) => {
      let newX = layer.x
      let newY = layer.y

      switch (alignment) {
        case "align-left": newX = bounds.left; break
        case "align-center-horizontal": newX = centerX - layer.width / 2; break
        case "align-right": newX = bounds.right - layer.width; break
        case "align-top": newY = bounds.top; break
        case "align-center-vertical": newY = centerY - layer.height / 2; break
        case "align-bottom": newY = bounds.bottom - layer.height; break
      }
      updateLayer(layer.id, { x: newX, y: newY })
    })
  }

  const handleDistributeLayers = (distribution: "distribute-horizontal" | "distribute-vertical") => {
    if (selectedLayers.length < 3) return

    if (distribution === "distribute-horizontal") {
      const sorted = [...selectedLayers].sort((a, b) => a.x - b.x)
      const totalWidth = sorted.reduce((sum, l) => sum + l.width, 0)
      const totalSpace = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width - sorted[0].x
      const spacing = (totalSpace - totalWidth) / (sorted.length - 1)
      
      let currentX = sorted[0].x + sorted[0].width + spacing
      for (let i = 1; i < sorted.length - 1; i++) {
        updateLayer(sorted[i].id, { x: currentX })
        currentX += sorted[i].width + spacing
      }
    } else {
      const sorted = [...selectedLayers].sort((a, b) => a.y - b.y)
      const totalHeight = sorted.reduce((sum, l) => sum + l.height, 0)
      const totalSpace = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height - sorted[0].y
      const spacing = (totalSpace - totalHeight) / (sorted.length - 1)

      let currentY = sorted[0].y + sorted[0].height + spacing
      for (let i = 1; i < sorted.length - 1; i++) {
        updateLayer(sorted[i].id, { y: currentY })
        currentY += sorted[i].height + spacing
      }
    }
  }

  return (
    <div className="border-t border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <h3 className="text-base font-semibold">Layout Tools</h3>
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4">
          {!hasMultipleSelection ? (
            <div className="text-center text-sm text-muted-foreground py-4">
              <p>Select multiple layers to use layout tools</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Align</Label>
                <div className="grid grid-cols-3 gap-1">
                  <Button variant="outline" size="icon" onClick={() => handleAlignLayers("align-left")} title="Align Left"><AlignHorizontalJustifyStart className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleAlignLayers("align-center-horizontal")} title="Align Center Horizontal"><AlignHorizontalJustifyCenter className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleAlignLayers("align-right")} title="Align Right"><AlignHorizontalJustifyEnd className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleAlignLayers("align-top")} title="Align Top"><AlignVerticalJustifyStart className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleAlignLayers("align-center-vertical")} title="Align Center Vertical"><AlignVerticalJustifyCenter className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => handleAlignLayers("align-bottom")} title="Align Bottom"><AlignVerticalJustifyEnd className="h-4 w-4" /></Button>
                </div>
              </div>

              {selectedLayers.length > 2 && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Distribute</Label>
                  <div className="grid grid-cols-2 gap-1">
                    <Button variant="outline" size="icon" onClick={() => handleDistributeLayers("distribute-horizontal")} title="Distribute Horizontally"><AlignHorizontalSpaceAround className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => handleDistributeLayers("distribute-vertical")} title="Distribute Vertically"><AlignVerticalSpaceAround className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}