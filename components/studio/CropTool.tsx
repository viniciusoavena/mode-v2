"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, RotateCw } from "lucide-react"

interface CropToolProps {
  layer: any
  onUpdate: (id: string, updates: any) => void
  onCancel: () => void
  zoom: number
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export function CropTool({ layer, onUpdate, onCancel, zoom }: CropToolProps) {
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 0,
    y: 0,
    width: layer.width,
    height: layer.height,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialCrop, setInitialCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 })
  const cropRef = useRef<HTMLDivElement>(null)

  // Initialize crop area
  useEffect(() => {
    const existingCrop = layer.properties?.crop
    if (existingCrop) {
      setCropArea(existingCrop)
    } else {
      // Default to full image with small margin
      const margin = 20
      setCropArea({
        x: margin,
        y: margin,
        width: layer.width - margin * 2,
        height: layer.height - margin * 2,
      })
    }
  }, [layer])

  // Handle crop area drag
  const handleCropMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return

      e.preventDefault()
      e.stopPropagation()

      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialCrop({ ...cropArea })
    },
    [cropArea],
  )

  // Handle resize handles
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: string) => {
      e.preventDefault()
      e.stopPropagation()

      setIsResizing(handle)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialCrop({ ...cropArea })
    },
    [cropArea],
  )

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        const newX = Math.max(0, Math.min(initialCrop.x + deltaX, layer.width - cropArea.width))
        const newY = Math.max(0, Math.min(initialCrop.y + deltaY, layer.height - cropArea.height))

        setCropArea((prev) => ({ ...prev, x: newX, y: newY }))
      } else if (isResizing) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        const newCrop = { ...initialCrop }

        switch (isResizing) {
          case "top-left":
            newCrop.x = Math.max(0, Math.min(initialCrop.x + deltaX, initialCrop.x + initialCrop.width - 20))
            newCrop.y = Math.max(0, Math.min(initialCrop.y + deltaY, initialCrop.y + initialCrop.height - 20))
            newCrop.width = initialCrop.width - (newCrop.x - initialCrop.x)
            newCrop.height = initialCrop.height - (newCrop.y - initialCrop.y)
            break
          case "top-right":
            newCrop.y = Math.max(0, Math.min(initialCrop.y + deltaY, initialCrop.y + initialCrop.height - 20))
            newCrop.width = Math.max(20, Math.min(initialCrop.width + deltaX, layer.width - initialCrop.x))
            newCrop.height = initialCrop.height - (newCrop.y - initialCrop.y)
            break
          case "bottom-left":
            newCrop.x = Math.max(0, Math.min(initialCrop.x + deltaX, initialCrop.x + initialCrop.width - 20))
            newCrop.width = initialCrop.width - (newCrop.x - initialCrop.x)
            newCrop.height = Math.max(20, Math.min(initialCrop.height + deltaY, layer.height - initialCrop.y))
            break
          case "bottom-right":
            newCrop.width = Math.max(20, Math.min(initialCrop.width + deltaX, layer.width - initialCrop.x))
            newCrop.height = Math.max(20, Math.min(initialCrop.height + deltaY, layer.height - initialCrop.y))
            break
          case "top":
            newCrop.y = Math.max(0, Math.min(initialCrop.y + deltaY, initialCrop.y + initialCrop.height - 20))
            newCrop.height = initialCrop.height - (newCrop.y - initialCrop.y)
            break
          case "bottom":
            newCrop.height = Math.max(20, Math.min(initialCrop.height + deltaY, layer.height - initialCrop.y))
            break
          case "left":
            newCrop.x = Math.max(0, Math.min(initialCrop.x + deltaX, initialCrop.x + initialCrop.width - 20))
            newCrop.width = initialCrop.width - (newCrop.x - initialCrop.x)
            break
          case "right":
            newCrop.width = Math.max(20, Math.min(initialCrop.width + deltaX, layer.width - initialCrop.x))
            break
        }

        setCropArea(newCrop)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = isDragging ? "move" : "resize"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = "default"
      }
    }
  }, [isDragging, isResizing, dragStart, initialCrop, cropArea, layer, zoom])

  // Apply crop
  const applyCrop = useCallback(() => {
    const cropData = {
      x: cropArea.x,
      y: cropArea.y,
      width: cropArea.width,
      height: cropArea.height,
    }

    onUpdate(layer.id, {
      properties: {
        ...layer.properties,
        crop: cropData,
      },
      width: cropArea.width,
      height: cropArea.height,
    })
  }, [layer, cropArea, onUpdate])

  // Reset crop
  const resetCrop = useCallback(() => {
    setCropArea({
      x: 0,
      y: 0,
      width: layer.width,
      height: layer.height,
    })
  }, [layer])

  // Preset ratios
  const applyRatio = useCallback(
    (ratio: number | null) => {
      if (ratio === null) {
        // Free form
        return
      }

      const centerX = cropArea.x + cropArea.width / 2
      const centerY = cropArea.y + cropArea.height / 2

      let newWidth = cropArea.width
      let newHeight = cropArea.height

      if (ratio > 1) {
        // Landscape
        newHeight = newWidth / ratio
      } else {
        // Portrait or square
        newWidth = newHeight * ratio
      }

      // Ensure it fits within the image
      newWidth = Math.min(newWidth, layer.width)
      newHeight = Math.min(newHeight, layer.height)

      // Recalculate if needed
      if (ratio > 1 && newHeight * ratio > layer.width) {
        newWidth = layer.width
        newHeight = newWidth / ratio
      } else if (ratio <= 1 && newWidth / ratio > layer.height) {
        newHeight = layer.height
        newWidth = newHeight * ratio
      }

      const newX = Math.max(0, Math.min(centerX - newWidth / 2, layer.width - newWidth))
      const newY = Math.max(0, Math.min(centerY - newHeight / 2, layer.height - newHeight))

      setCropArea({
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      })
    },
    [cropArea, layer],
  )

  const handleStyle =
    "absolute w-3 h-3 bg-white border-2 border-primary rounded-sm hover:scale-125 transition-transform cursor-pointer shadow-lg"

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1000 }}>
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{
          left: `${layer.x * zoom}px`,
          top: `${layer.y * zoom}px`,
          width: `${layer.width * zoom}px`,
          height: `${layer.height * zoom}px`,
        }}
      />

      {/* Crop Area */}
      <div
        ref={cropRef}
        className="absolute border-2 border-primary bg-transparent pointer-events-auto cursor-move"
        style={{
          left: `${(layer.x + cropArea.x) * zoom}px`,
          top: `${(layer.y + cropArea.y) * zoom}px`,
          width: `${cropArea.width * zoom}px`,
          height: `${cropArea.height * zoom}px`,
        }}
        onMouseDown={handleCropMouseDown}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Rule of thirds */}
          <div className="absolute left-1/3 top-0 w-px h-full bg-white/30" />
          <div className="absolute left-2/3 top-0 w-px h-full bg-white/30" />
          <div className="absolute top-1/3 left-0 h-px w-full bg-white/30" />
          <div className="absolute top-2/3 left-0 h-px w-full bg-white/30" />
        </div>

        {/* Corner Handles */}
        <div
          className={handleStyle + " -top-1.5 -left-1.5 cursor-nw-resize"}
          onMouseDown={(e) => handleResizeStart(e, "top-left")}
        />
        <div
          className={handleStyle + " -top-1.5 -right-1.5 cursor-ne-resize"}
          onMouseDown={(e) => handleResizeStart(e, "top-right")}
        />
        <div
          className={handleStyle + " -bottom-1.5 -left-1.5 cursor-sw-resize"}
          onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
        />
        <div
          className={handleStyle + " -bottom-1.5 -right-1.5 cursor-se-resize"}
          onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
        />

        {/* Edge Handles */}
        <div
          className={handleStyle + " -top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize"}
          onMouseDown={(e) => handleResizeStart(e, "top")}
        />
        <div
          className={handleStyle + " -bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize"}
          onMouseDown={(e) => handleResizeStart(e, "bottom")}
        />
        <div
          className={handleStyle + " -left-1.5 top-1/2 -translate-y-1/2 cursor-w-resize"}
          onMouseDown={(e) => handleResizeStart(e, "left")}
        />
        <div
          className={handleStyle + " -right-1.5 top-1/2 -translate-y-1/2 cursor-e-resize"}
          onMouseDown={(e) => handleResizeStart(e, "right")}
        />
      </div>

      {/* Crop Controls */}
      <div
        className="absolute pointer-events-auto"
        style={{
          left: `${layer.x * zoom}px`,
          top: `${(layer.y - 60) * zoom}px`,
        }}
      >
        <div className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
          {/* Aspect Ratio Presets */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => applyRatio(null)} className="text-xs h-7">
              Free
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyRatio(1)} className="text-xs h-7">
              1:1
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyRatio(4 / 3)} className="text-xs h-7">
              4:3
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyRatio(16 / 9)} className="text-xs h-7">
              16:9
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyRatio(3 / 4)} className="text-xs h-7">
              3:4
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Transform Tools */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={resetCrop} className="text-xs h-7 bg-transparent">
              <RotateCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={onCancel} className="text-xs h-7 bg-transparent">
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={applyCrop} className="text-xs h-7 bg-primary text-primary-foreground">
              <Check className="h-3 w-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Crop Info */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${(layer.x + cropArea.x) * zoom}px`,
          top: `${(layer.y + cropArea.y + cropArea.height + 10) * zoom}px`,
        }}
      >
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded px-2 py-1 text-xs text-muted-foreground">
          {Math.round(cropArea.width)} × {Math.round(cropArea.height)}
        </div>
      </div>
    </div>
  )
}
