"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalDistributeStart,
  AlignVerticalDistributeStart,
  Square,
  Maximize,
  Eye,
  Monitor,
} from "lucide-react"

interface AlignmentToolsProps {
  selectedLayers: any[]
  onUpdateLayers: (updates: { id: string; changes: any }[]) => void
  canvasState: any
  onAddToHistory: (description: string, data: any) => void
  getVisibleCenter?: () => { x: number; y: number }
  getVisibleBounds?: () => { x: number; y: number; width: number; height: number }
}

type AlignmentType = "left" | "center" | "right" | "top" | "middle" | "bottom"
type DistributionType = "horizontal" | "vertical"
type AlignmentReference = "selection" | "canvas" | "viewport"

export function AlignmentTools({
  selectedLayers,
  onUpdateLayers,
  canvasState,
  onAddToHistory,
  getVisibleCenter,
  getVisibleBounds,
}: AlignmentToolsProps) {
  const hasMultipleSelection = selectedLayers.length > 1
  const hasSelection = selectedLayers.length > 0

  // Calculate bounds for selected layers
  const getSelectionBounds = () => {
    if (selectedLayers.length === 0) return null

    let minX = Number.POSITIVE_INFINITY
    let minY = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    selectedLayers.forEach((layer) => {
      minX = Math.min(minX, layer.x)
      minY = Math.min(minY, layer.y)
      maxX = Math.max(maxX, layer.x + layer.width)
      maxY = Math.max(maxY, layer.y + layer.height)
    })

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: minX + (maxX - minX) / 2,
      centerY: minY + (maxY - minY) / 2,
    }
  }

  // Align layers
  const alignLayers = (type: AlignmentType, reference: AlignmentReference = "selection") => {
    if (selectedLayers.length === 0) return

    const updates: { id: string; changes: any }[] = []
    let referenceBounds

    if (reference === "canvas") {
      // Use full canvas dimensions
      referenceBounds = {
        x: 0,
        y: 0,
        width: canvasState.width,
        height: canvasState.height,
        centerX: canvasState.width / 2,
        centerY: canvasState.height / 2,
      }
    } else if (reference === "viewport" && getVisibleCenter && getVisibleBounds) {
      // Use visible viewport (what user sees)
      const visibleBounds = getVisibleBounds()
      const visibleCenter = getVisibleCenter()

      referenceBounds = {
        x: visibleBounds.x,
        y: visibleBounds.y,
        width: visibleBounds.width,
        height: visibleBounds.height,
        centerX: visibleCenter.x,
        centerY: visibleCenter.y,
      }
    } else {
      // Use selection bounds
      referenceBounds = getSelectionBounds()
      if (!referenceBounds) return
    }

    selectedLayers.forEach((layer) => {
      const changes: any = {}

      switch (type) {
        case "left":
          changes.x = referenceBounds.x
          break
        case "center":
          changes.x = referenceBounds.centerX - layer.width / 2
          break
        case "right":
          changes.x = referenceBounds.x + referenceBounds.width - layer.width
          break
        case "top":
          changes.y = referenceBounds.y
          break
        case "middle":
          changes.y = referenceBounds.centerY - layer.height / 2
          break
        case "bottom":
          changes.y = referenceBounds.y + referenceBounds.height - layer.height
          break
      }

      updates.push({ id: layer.id, changes })
    })

    onUpdateLayers(updates)

    const referenceText = reference === "viewport" ? "visible area" : reference
    onAddToHistory(`Aligned ${selectedLayers.length} layers ${type} to ${referenceText}`, {
      type: "alignment",
      alignmentType: type,
      reference,
      layerCount: selectedLayers.length,
    })
  }

  // Distribute layers
  const distributeLayers = (type: DistributionType) => {
    if (selectedLayers.length < 3) return

    const updates: { id: string; changes: any }[] = []
    const sortedLayers = [...selectedLayers]

    if (type === "horizontal") {
      // Sort by x position
      sortedLayers.sort((a, b) => a.x - b.x)

      const firstLayer = sortedLayers[0]
      const lastLayer = sortedLayers[sortedLayers.length - 1]
      const totalSpace = lastLayer.x + lastLayer.width - firstLayer.x
      const totalLayerWidth = sortedLayers.reduce((sum, layer) => sum + layer.width, 0)
      const availableSpace = totalSpace - totalLayerWidth
      const spacing = availableSpace / (sortedLayers.length - 1)

      let currentX = firstLayer.x + firstLayer.width

      for (let i = 1; i < sortedLayers.length - 1; i++) {
        const layer = sortedLayers[i]
        updates.push({
          id: layer.id,
          changes: { x: currentX + spacing },
        })
        currentX += spacing + layer.width
      }
    } else {
      // Sort by y position
      sortedLayers.sort((a, b) => a.y - b.y)

      const firstLayer = sortedLayers[0]
      const lastLayer = sortedLayers[sortedLayers.length - 1]
      const totalSpace = lastLayer.y + lastLayer.height - firstLayer.y
      const totalLayerHeight = sortedLayers.reduce((sum, layer) => sum + layer.height, 0)
      const availableSpace = totalSpace - totalLayerHeight
      const spacing = availableSpace / (sortedLayers.length - 1)

      let currentY = firstLayer.y + firstLayer.height

      for (let i = 1; i < sortedLayers.length - 1; i++) {
        const layer = sortedLayers[i]
        updates.push({
          id: layer.id,
          changes: { y: currentY + spacing },
        })
        currentY += spacing + layer.height
      }
    }

    onUpdateLayers(updates)
    onAddToHistory(`Distributed ${selectedLayers.length} layers ${type}ly`, {
      type: "distribution",
      distributionType: type,
      layerCount: selectedLayers.length,
    })
  }

  // Smart spacing - evenly space layers
  const applySmartSpacing = (spacing: number, direction: "horizontal" | "vertical") => {
    if (selectedLayers.length < 2) return

    const updates: { id: string; changes: any }[] = []
    const sortedLayers = [...selectedLayers]

    if (direction === "horizontal") {
      sortedLayers.sort((a, b) => a.x - b.x)
      let currentX = sortedLayers[0].x + sortedLayers[0].width

      for (let i = 1; i < sortedLayers.length; i++) {
        const layer = sortedLayers[i]
        updates.push({
          id: layer.id,
          changes: { x: currentX + spacing },
        })
        currentX += spacing + layer.width
      }
    } else {
      sortedLayers.sort((a, b) => a.y - b.y)
      let currentY = sortedLayers[0].y + sortedLayers[0].height

      for (let i = 1; i < sortedLayers.length; i++) {
        const layer = sortedLayers[i]
        updates.push({
          id: layer.id,
          changes: { y: currentY + spacing },
        })
        currentY += spacing + layer.height
      }
    }

    onUpdateLayers(updates)
    onAddToHistory(`Applied ${spacing}px ${direction} spacing to ${selectedLayers.length} layers`, {
      type: "smart-spacing",
      spacing,
      direction,
      layerCount: selectedLayers.length,
    })
  }

  // Resize to fit content
  const resizeToFit = (dimension: "width" | "height" | "both") => {
    if (selectedLayers.length === 0) return

    const updates: { id: string; changes: any }[] = []

    selectedLayers.forEach((layer) => {
      const changes: any = {}

      if (layer.type === "text" && layer.properties?.text) {
        // Calculate text dimensions (simplified)
        const fontSize = layer.properties.fontSize || 30
        const text = layer.properties.text || ""

        if (dimension === "width" || dimension === "both") {
          changes.width = Math.max(text.length * fontSize * 0.6, 50)
        }
        if (dimension === "height" || dimension === "both") {
          changes.height = Math.max(fontSize * 1.2, 30)
        }
      }

      if (Object.keys(changes).length > 0) {
        updates.push({ id: layer.id, changes })
      }
    })

    if (updates.length > 0) {
      onUpdateLayers(updates)
      onAddToHistory(`Resized ${updates.length} layers to fit content`, {
        type: "resize-to-fit",
        dimension,
        layerCount: updates.length,
      })
    }
  }

  if (!hasSelection) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/20 flex items-center justify-center">
          <Square className="w-6 h-6" />
        </div>
        <p>Select layers to use alignment tools</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold mb-2">Layout Tools</h3>
        <p className="text-xs text-muted-foreground">
          {selectedLayers.length} layer{selectedLayers.length > 1 ? "s" : ""} selected
        </p>
      </div>

      {/* Alignment Controls */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">Align</Label>
          <div className="grid grid-cols-3 gap-1">
            {/* Horizontal Alignment */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => alignLayers("left")}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => alignLayers("center")}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => alignLayers("right")}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>

            {/* Vertical Alignment */}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => alignLayers("top")}
              title="Align Top"
            >
              <AlignVerticalJustifyStart className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => alignLayers("middle")}
              title="Align Middle"
            >
              <AlignVerticalJustifyCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => alignLayers("bottom")}
              title="Align Bottom"
            >
              <AlignVerticalJustifyEnd className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alignment Reference */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Align to</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignLayers("center", "selection")}
              className="text-xs flex items-center gap-1"
              title="Align to selection bounds"
            >
              <Square className="h-3 w-3" />
              Selection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignLayers("center", "viewport")}
              className="text-xs flex items-center gap-1"
              title="Align to visible area"
            >
              <Eye className="h-3 w-3" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alignLayers("center", "canvas")}
              className="text-xs flex items-center gap-1"
              title="Align to full canvas"
            >
              <Monitor className="h-3 w-3" />
              Canvas
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Distribution Controls */}
      {hasMultipleSelection && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Distribute</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => distributeLayers("horizontal")}
                disabled={selectedLayers.length < 3}
                className="flex items-center gap-2"
              >
                <AlignHorizontalDistributeStart className="h-4 w-4" />
                <span className="text-xs">Horizontal</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => distributeLayers("vertical")}
                disabled={selectedLayers.length < 3}
                className="flex items-center gap-2"
              >
                <AlignVerticalDistributeStart className="h-4 w-4" />
                <span className="text-xs">Vertical</span>
              </Button>
            </div>
            {selectedLayers.length < 3 && (
              <p className="text-xs text-muted-foreground mt-2">Need 3+ layers to distribute</p>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Smart Spacing */}
      {hasMultipleSelection && (
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Smart Spacing</Label>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySmartSpacing(10, "horizontal")}
                  className="text-xs"
                >
                  10px H
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySmartSpacing(20, "horizontal")}
                  className="text-xs"
                >
                  20px H
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySmartSpacing(40, "horizontal")}
                  className="text-xs"
                >
                  40px H
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySmartSpacing(10, "vertical")}
                  className="text-xs"
                >
                  10px V
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySmartSpacing(20, "vertical")}
                  className="text-xs"
                >
                  20px V
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => applySmartSpacing(40, "vertical")}
                  className="text-xs"
                >
                  40px V
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Resize Tools */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-3 block">Resize</Label>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => resizeToFit("both")}
              className="w-full justify-start text-xs"
            >
              <Maximize className="h-4 w-4 mr-2" />
              Resize to Fit Content
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => resizeToFit("width")} className="text-xs">
                Fit Width
              </Button>
              <Button variant="outline" size="sm" onClick={() => resizeToFit("height")} className="text-xs">
                Fit Height
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Label className="text-sm font-medium block">Quick Actions</Label>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alignLayers("center", "viewport")
              alignLayers("middle", "viewport")
            }}
            className="text-xs flex items-center gap-2"
            title="Center in visible area"
          >
            <Eye className="h-3 w-3" />
            Center in View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              alignLayers("center", "canvas")
              alignLayers("middle", "canvas")
            }}
            className="text-xs flex items-center gap-2"
            title="Center in full canvas"
          >
            <Monitor className="h-3 w-3" />
            Center in Canvas
          </Button>
          {hasMultipleSelection && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                distributeLayers("horizontal")
                alignLayers("middle")
              }}
              disabled={!hasMultipleSelection}
              className="text-xs"
            >
              Auto Layout
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
