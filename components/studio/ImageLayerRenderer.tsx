"use client"

import type React from "react"
import type { CSSProperties } from "react"
import { useState } from "react"
import { SelectionBox } from "./SelectionBox"
import { CropTool } from "./CropTool"
import type { Layer } from "@/app/types/layer-types"

interface ImageLayerRendererProps {
  layer: Layer
  isSelected: boolean
  onUpdate: (id: string, updates: Partial<Layer>) => void
  onSelect: (id: string, multiSelect?: boolean) => void
  zoom: number
  snapToGrid?: boolean
  gridSize?: number
}

export function ImageLayerRenderer({
  layer,
  isSelected,
  onUpdate,
  onSelect,
  zoom,
  snapToGrid,
  gridSize,
}: ImageLayerRendererProps) {
  const [isCropping, setIsCropping] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(layer.id, e.ctrlKey || e.metaKey)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (layer.type === "image") {
      setIsCropping(true)
    }
  }

  const handleCropComplete = (id: string, updates: any) => {
    onUpdate(id, updates)
    setIsCropping(false)
  }

  const handleCropCancel = () => {
    setIsCropping(false)
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

  // Calculate crop styles if crop is applied
  const cropData = layer.crop
  const imageStyle: React.CSSProperties = {}

  if (cropData) {
    imageStyle.objectFit = "cover"
    imageStyle.objectPosition = `${-cropData.x}px ${-cropData.y}px`
    imageStyle.width = `${(layer.width) * zoom}px`
    imageStyle.height = `${(layer.height) * zoom}px`
  }

  return (
    <>
      {/* Layer Content */}
      <div
        className={`absolute border transition-all duration-200 overflow-hidden ${
          isSelected ? "border-primary/50" : "border-transparent hover:border-primary/30"
        } ${isCropping ? "border-primary border-2" : ""}`}
        style={layerStyle}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {layer.type === "image" ? (
          <div className="w-full h-full relative">
            {layer.imageUrl ? (
              <img
                src={layer.imageUrl || "/placeholder.svg"}
                alt={layer.name}
                className="w-full h-full object-cover"
                style={imageStyle}
                draggable={false}
              />
            ) : (
              <div className="w-full h-full bg-muted/20 border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground">
                {layer.name}
              </div>
            )}

            {/* Crop indicator */}
            {cropData && !isCropping && (
              <div className="absolute top-1 right-1 bg-primary/80 text-primary-foreground text-xs px-1 py-0.5 rounded">
                Cropped
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-muted-foreground/30">
            {layer.name}
          </div>
        )}
      </div>

      {/* Crop Tool */}
      {isCropping && <CropTool layer={layer} onUpdate={handleCropComplete} onCancel={handleCropCancel} zoom={zoom} />}

      {/* Selection Controls */}
      {!isCropping && (
        <SelectionBox
          layer={layer}
          isSelected={isSelected}
          onUpdate={onUpdate}
          onSelect={onSelect}
          zoom={zoom}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />
      )}
    </>
  )
}
