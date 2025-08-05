"use client"

import type React from "react"
import type { CSSProperties } from "react"
import { ImageLayerRenderer } from "./ImageLayerRenderer"
import { SelectionBox } from "./SelectionBox"
import { LayerContextMenu } from "./ContextMenu"
import type { Layer } from "@/app/types/layer-types"

interface LayerRendererProps {
  layer: Layer
  isSelected: boolean
  onUpdate: (id: string, updates: Partial<Layer>) => void
  onSelect: (id: string, multiSelect?: boolean) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onToggleVisibility?: (id: string) => void
  onToggleLock?: (id: string) => void
  onMoveLayer?: (id: string, direction: "up" | "down") => void
  onAlign?: (type: string) => void
  onFlip?: (direction: "horizontal" | "vertical") => void
  onRotate?: (degrees: number) => void
  onCrop?: () => void
  onDownload?: () => void
  zoom: number
  snapToGrid?: boolean
  gridSize?: number
  selectedLayers?: Layer[]
}

export function LayerRenderer({
  layer,
  isSelected,
  onUpdate,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  onAlign,
  onFlip,
  onRotate,
  onCrop,
  onDownload,
  zoom,
  snapToGrid,
  gridSize,
  selectedLayers = [],
}: LayerRendererProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(layer.id, e.ctrlKey || e.metaKey)
  }

  const handleContextMenuActions = {
    onCopy: () => {
      // Implement copy functionality
      console.log("Copy layer:", layer.id)
    },
    onCut: () => {
      // Implement cut functionality
      console.log("Cut layer:", layer.id)
    },
    onDelete: () => onDelete?.(layer.id),
    onDuplicate: () => onDuplicate?.(layer.id),
    onToggleVisibility: () => onToggleVisibility?.(layer.id),
    onToggleLock: () => onToggleLock?.(layer.id),
    onMoveLayer: (direction: "up" | "down") => onMoveLayer?.(layer.id, direction),
    onAlign: (type: string) => onAlign?.(type),
    onFlip: (direction: "horizontal" | "vertical") => {
      if (direction === "horizontal") {
        const currentRotation = layer.rotation || 0
        onUpdate(layer.id, {
          rotation: currentRotation,
        })
      } else {
        const currentRotation = layer.rotation || 0
        onUpdate(layer.id, {
          rotation: currentRotation,
        })
      }
    },
    onRotate: (degrees: number) => {
      const currentRotation = layer.rotation || 0
      onUpdate(layer.id, { rotation: currentRotation + degrees })
    },
    onCrop: () => {
      if (layer.type === "image") {
        onCrop?.()
      }
    },
    onEdit: () => {
      // Focus on the layer in the right panel
      console.log("Edit layer properties:", layer.id)
    },
    onDownload: () => onDownload?.(),
  }

  // Use specialized renderer for images
  if (layer.type === "image") {
    return (
      <LayerContextMenu layer={layer} selectedLayers={selectedLayers} {...handleContextMenuActions}>
        <ImageLayerRenderer
          layer={layer}
          isSelected={isSelected}
          onUpdate={onUpdate}
          onSelect={onSelect}
          zoom={zoom}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />
      </LayerContextMenu>
    )
  }

  const layerStyle: CSSProperties = {
    position: "absolute",
    left: `${layer.x * zoom}px`,
    top: `${layer.y * zoom}px`,
    width: `${layer.width * zoom}px`,
    height: `${layer.height * zoom}px`,
    transform: `rotate(${layer.rotation || 0}deg)`,
    transformOrigin: "center center",
    opacity: layer.opacity || 1,
    visibility: layer.visible ? "visible" : "hidden",
    pointerEvents: layer.locked ? "none" : "auto",
  }

  return (
    <LayerContextMenu layer={layer} selectedLayers={selectedLayers} {...handleContextMenuActions}>
      <>
        {/* Layer Content */}
        <div
          className={`absolute border transition-all duration-200 ${
            isSelected ? "border-primary/50" : "border-transparent hover:border-primary/30"
          }`}
          style={layerStyle}
          onClick={handleClick}
        >
          {layer.type === "text" ? (
            <div
              className="w-full h-full flex items-center justify-center text-center p-2 cursor-text"
              style={{
                fontFamily: layer.fontFamily || "Inter",
                fontSize: `${(layer.fontSize || 30) * zoom}px`,
                fontWeight: layer.fontWeight || "normal",
                color: layer.fontColor || "#ffffff",
                fontStyle: layer.fontStyle ? "italic" : "normal",
                textDecoration: layer.textDecoration || "none",
                textAlign: (layer.textAlign as any) || "center",
              }}
            >
              {layer.content || layer.name}
            </div>
          ) : layer.type === "shape" ? (
            <div
              className="w-full h-full rounded"
              style={{
                backgroundColor: layer.fill || "#6366f1",
                borderRadius: layer.borderRadius || "0px",
              }}
            />
          ) : (
            <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-muted-foreground/30 rounded">
              {layer.name}
            </div>
          )}
        </div>

        {/* Selection Controls */}
        <SelectionBox
          layer={layer}
          isSelected={isSelected}
          onUpdate={onUpdate}
          onSelect={onSelect}
          zoom={zoom}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />
      </>
    </LayerContextMenu>
  )
}
