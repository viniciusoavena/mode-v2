"use client"
import { useState, useEffect, useRef } from "react"
import { useStudioStore } from "@/store/studio-store"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { creativeModesData } from "@/lib/mock-data"
import { LayoutToolsSection } from "./LayoutToolsSection"
import { Layers3, ImageIcon, Type, GripVertical, Eye, Lock, EyeOff, Square, Frame, Zap, Trash2, Copy, Group, Ungroup } from "lucide-react"
import { ShapeSelector } from "@/components/shape-selector"
import { FrameDialog } from "@/components/FrameDialog"
import type { Layer } from "@/app/types/layer-types"
import { cn } from "@/lib/utils"

export function LeftPanel() {
  const {
    layers,
    selectedLayerIds,
    creativeMode,
    resourceType,
    selectLayer,
    addLayer,
    toggleLayerVisibility,
    toggleLayerLock,
    setCreativeMode,
    setResourceType,
    groupLayers,
    ungroupLayers,
    duplicateSelectedLayers,
    deleteSelectedLayers,
    reorderLayers,
  } = useStudioStore()

  const [isShapeSelectorOpen, setIsShapeSelectorOpen] = useState(false)
  const [isFrameDialogOpen, setIsFrameDialogOpen] = useState(false)
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null)
  const dragOverLayerId = useRef<string | null>(null)

  // CORREÇÃO: Lógica aprimorada para garantir que um contexto válido seja sempre selecionado.
  useEffect(() => {
    const mode = creativeModesData.find(m => m.id === creativeMode);
    if (mode && (!resourceType || !mode.contexts.includes(resourceType))) {
      // Se o resourceType atual não for válido para o novo modo, seleciona o primeiro da lista.
      setResourceType(mode.contexts[0]);
    }
  }, [creativeMode, resourceType, setResourceType]);


  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex)

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingLayerId(id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault()
    if (id !== dragOverLayerId.current) {
        dragOverLayerId.current = id
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    dragOverLayerId.current = null
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault()
    const draggedId = draggingLayerId
    if (draggedId && draggedId !== targetId) {
      reorderLayers(draggedId, targetId)
    }
    setDraggingLayerId(null)
    dragOverLayerId.current = null
  }

  const handleDragEnd = () => {
    setDraggingLayerId(null)
    dragOverLayerId.current = null
  }

  const handleShapeSelect = (shapeType: any) => {
    addLayer({ type: "shape", name: `New ${shapeType}` })
    setIsShapeSelectorOpen(false)
  }

  const handleCreateFrame = (width: number, height: number) => {
    addLayer({ type: "frame", width, height, name: "New Frame" })
    setIsFrameDialogOpen(false)
  }

  const currentModeData = creativeModesData.find(m => m.id === creativeMode)

  return (
    <>
      <div className="flex h-full flex-col bg-card/80 backdrop-blur-xl">
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <h3 className="text-base font-semibold">Creative Mode</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {creativeModesData.map((mode) => (
              <Button
                key={mode.id}
                variant={creativeMode === mode.id ? "secondary" : "outline"}
                className="justify-start text-left h-auto"
                onClick={() => setCreativeMode(mode.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-background rounded-md">
                    <mode.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{mode.name}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          <div className="mt-4">
            <Label className="text-sm font-medium text-muted-foreground">Context</Label>
            <Select value={resourceType || ""} onValueChange={setResourceType}>
              <SelectTrigger className="w-full mt-2 bg-background border-border">
                <SelectValue placeholder="Select a context..." />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {currentModeData?.contexts.map(context => (
                  <SelectItem key={context} value={context}>{context}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 flex items-center justify-between flex-shrink-0 border-b border-border">
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5" />
              <h3 className="text-base font-semibold">Layers</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button onClick={() => addLayer({ type: "image", name: "New Image" })} variant="ghost" size="icon" className="h-7 w-7" title="Add Image Layer">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button onClick={() => addLayer({ type: "text", name: "New Text" })} variant="ghost" size="icon" className="h-7 w-7" title="Add Text Layer">
                <Type className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsShapeSelectorOpen(true)} variant="ghost" size="icon" className="h-7 w-7" title="Add Shape Layer">
                <Square className="h-4 w-4" />
              </Button>
              <Button onClick={() => setIsFrameDialogOpen(true)} variant="ghost" size="icon" className="h-7 w-7" title="Add Frame Layer">
                <Frame className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 px-2 py-2">
            <div className="space-y-1" onDragEnd={handleDragEnd}>
              {sortedLayers.length > 0 ? (
                sortedLayers.map((layer) => (
                  <LayerItem
                    key={layer.id}
                    layer={layer}
                    isSelected={selectedLayerIds.includes(layer.id)}
                    isDragging={draggingLayerId === layer.id}
                    onSelectLayer={(id, shiftKey) => selectLayer(id, shiftKey)}
                    onToggleVisibility={toggleLayerVisibility}
                    onToggleLock={toggleLayerLock}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <p>No layers yet</p>
                  <p className="text-xs mt-1">Add a layer to get started</p>
                </div>
              )}
            </div>
          </ScrollArea>
          <LayerActions
            onGroup={groupLayers}
            onUngroup={ungroupLayers}
            onDuplicate={duplicateSelectedLayers}
            onDelete={deleteSelectedLayers}
            canGroup={selectedLayerIds.length > 1}
            canUngroup={selectedLayerIds.length === 1 && layers.find(l => l.id === selectedLayerIds[0])?.type === 'group'}
            canDuplicate={selectedLayerIds.length > 0}
            canDelete={selectedLayerIds.length > 0}
          />
        </div>

        <LayoutToolsSection />
      </div>
      <ShapeSelector open={isShapeSelectorOpen} onOpenChange={setIsShapeSelectorOpen} onShapeSelect={handleShapeSelect} />
      <FrameDialog open={isFrameDialogOpen} onOpenChange={setIsFrameDialogOpen} onCreateFrame={handleCreateFrame} />
    </>
  )
}

function LayerItem({ layer, isSelected, isDragging, onSelectLayer, onToggleVisibility, onToggleLock, onDragStart, onDragOver, onDragLeave, onDrop }) {
  const Icon = layer.type === "image" ? ImageIcon : layer.type === 'text' ? Type : layer.type === 'group' ? Group : Square

  return (
    <div
      draggable={!layer.locked}
      onDragStart={(e) => onDragStart(e, layer.id)}
      onDragOver={(e) => onDragOver(e, layer.id)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, layer.id)}
      onClick={(e) => onSelectLayer(layer.id, e.shiftKey)}
      className={cn(
        "w-full flex items-center gap-2 rounded-lg p-2 transition-colors group cursor-pointer",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
        isDragging && "opacity-50 border-dashed border-primary"
      )}
    >
      <div className="text-muted-foreground group-hover:text-foreground cursor-grab">
        <GripVertical className="h-4 w-4" />
      </div>
      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <span className="text-sm font-medium flex-1 text-left truncate">{layer.name}</span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id) }}
          className="p-1 hover:bg-background/50 rounded"
        >
          <Lock className={`h-3 w-3 ${layer.locked ? "text-red-400" : "text-muted-foreground"}`} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id) }}
          className="p-1 hover:bg-background/50 rounded"
        >
          {layer.visible ? <Eye className="h-3 w-3 text-muted-foreground" /> : <EyeOff className="h-3 w-3 text-red-400" />}
        </button>
      </div>
    </div>
  )
}

function LayerActions({ onGroup, onUngroup, onDuplicate, onDelete, canGroup, canUngroup, canDuplicate, canDelete }) {
  return (
    <div className="flex items-center justify-center gap-1 p-2 border-t border-border">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onGroup} disabled={!canGroup} title="Group Layers">
        <Group className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onUngroup} disabled={!canUngroup} title="Ungroup Layers">
        <Ungroup className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDuplicate} disabled={!canDuplicate} title="Duplicate Layer(s)">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete} disabled={!canDelete} title="Delete Layer(s)">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}