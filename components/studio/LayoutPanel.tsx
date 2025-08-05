"use client"

import { AlignmentTools } from "./AlignmentTools"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LayoutPanelProps {
  selectedLayers: any[]
  onUpdateLayers: (updates: { id: string; changes: any }[]) => void
  canvasState: any
  onAddToHistory: (description: string, data: any) => void
}

export function LayoutPanel({ selectedLayers, onUpdateLayers, canvasState, onAddToHistory }: LayoutPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4">
          <AlignmentTools
            selectedLayers={selectedLayers}
            onUpdateLayers={onUpdateLayers}
            canvasState={canvasState}
            onAddToHistory={onAddToHistory}
          />
        </div>
      </ScrollArea>
    </div>
  )
}
