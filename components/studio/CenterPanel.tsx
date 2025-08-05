"use client"

import { useRef, useEffect, useState } from "react"
import { useStudioStore } from "@/store/studio-store"
import { PromptBar } from "./PromptBar"
import { VariationsBar } from "./VariationsBar"
import { DraggableResizableLayer } from "@/components/draggable-resizable-layer"
import { LayerContextMenu } from "./ContextMenu"
import { Palette } from "lucide-react"
import { AlignmentToolbar } from "./AlignmentToolbar"
import { CropOverlay } from "./CropOverlay"
import { CanvasGrid } from "./CanvasGrid"

export function CenterPanel({ cropLayerId, setCropLayerId }: { cropLayerId: string | null, setCropLayerId: (id: string | null) => void }) {
  const {
    layers,
    selectedLayerIds,
    isGenerating,
    prompt,
    variations,
    selectedVariation,
    creativeMode,
    selectedContext,
    zoom,
    panX,
    panY,
    width,
    height,
    selectLayer,
    updateLayer,
    startGeneration,
    setVariations,
    selectVariation,
    showGrid,
    gridSize,
    gridOpacity,
  } = useStudioStore()

  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasBounds, setCanvasBounds] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      setCanvasBounds(canvasRef.current.getBoundingClientRect())
    }
  }, [zoom, panX, panY])

  const handleAlignLayers = (alignment: "align-left" | "align-center-horizontal" | "align-right" | "align-top" | "align-center-vertical" | "align-bottom") => {
    const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id))
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
    const selectedLayers = layers.filter(l => selectedLayerIds.includes(l.id))
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

  const handleCrop = (cropData: { x: number; y: number; width: number; height: number }) => {
    if (!cropLayerId) return
    const layer = layers.find(l => l.id === cropLayerId)
    if (!layer) return

    const newWidth = layer.width * cropData.width
    const newHeight = layer.height * cropData.height
    const newX = layer.x + layer.width * cropData.x
    const newY = layer.y + layer.height * cropData.y

    updateLayer(cropLayerId, { x: newX, y: newY, width: newWidth, height: newHeight })
    setCropLayerId(null)
  }

  const layerToCrop = layers.find(l => l.id === cropLayerId)
  const maskLayers = layers.filter(l => l.isMask)

  return (
    <div className="flex h-full flex-col items-center justify-center relative bg-muted/5">
      <div
        ref={containerRef}
        className="flex-1 w-full h-full flex items-center justify-center p-8 overflow-hidden relative"
        onClick={(e) => {
          if (e.target === containerRef.current) {
            selectLayer("")
          }
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <LayerContextMenu isCanvas={true} canPaste={false}>
            <div
              ref={canvasRef}
              className="relative bg-background border border-border rounded-lg shadow-lg overflow-hidden"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                transformOrigin: 'center',
              }}
            >
              <svg className="absolute w-0 h-0">
                <defs>
                  {maskLayers.map((mask) => (
                    <clipPath key={`mask-def-${mask.id}`} id={`mask-clip-${mask.id}`}>
                      <rect
                        x={mask.x}
                        y={mask.y}
                        width={mask.width}
                        height={mask.height}
                        transform={`rotate(${mask.rotation || 0} ${mask.x + mask.width / 2} ${mask.y + mask.height / 2})`}
                      />
                    </clipPath>
                  ))}
                </defs>
              </svg>
              <CanvasGrid
                width={width}
                height={height}
                gridSize={gridSize}
                gridOpacity={gridOpacity}
                showGrid={showGrid}
                zoom={zoom}
              />
              <div className="absolute inset-0">
                {layers.length > 0 ? (
                  <div className="absolute inset-0">
                    {layers
                      .filter((layer) => layer.visible && !layer.isMask)
                      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                      .map((layer) => (
                        <DraggableResizableLayer
                          key={layer.id}
                          layer={layer}
                          isSelected={selectedLayerIds.includes(layer.id)}
                          zoom={zoom}
                          onSelect={(id, shiftKey) => selectLayer(id, shiftKey)}
                          onUpdate={updateLayer}
                          onUpdateComplete={() => {}}
                          canvasBounds={canvasBounds}
                          isDraggable={!cropLayerId}
                          style={{
                            clipPath: layer.maskedBy ? `url(#mask-clip-${layer.maskedBy})` : 'none',
                          }}
                        />
                      ))}
                      {layerToCrop && (
                        <div style={{
                            position: 'absolute',
                            left: layerToCrop.x,
                            top: layerToCrop.y,
                            width: layerToCrop.width,
                            height: layerToCrop.height,
                            transform: `rotate(${layerToCrop.rotation || 0}deg)`,
                            transformOrigin: 'center'
                        }}>
                            <CropOverlay
                                layer={layerToCrop}
                                zoom={zoom}
                                onCrop={handleCrop}
                                onCancel={() => setCropLayerId(null)}
                            />
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Palette className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Ready to create something amazing?</h3>
                    <p className="text-muted-foreground mt-1">
                      Use the prompt bar below to generate your first social media post.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </LayerContextMenu>
        </div>
        {selectedLayerIds.length > 1 && !cropLayerId && (
          <AlignmentToolbar
            onAlign={handleAlignLayers}
            onDistribute={handleDistributeLayers}
          />
        )}
      </div>

      <VariationsBar
        variations={variations.map((v) => ({ id: v, url: v }))}
        selectedVariation={selectedVariation ? { id: selectedVariation, url: selectedVariation } : null}
        onSelectVariation={(v) => selectVariation(v.id)}
      />

      <PromptBar
        prompt={prompt}
        setPrompt={startGeneration}
        isGenerating={isGenerating}
        handleGenerate={startGeneration}
        selectedMode={creativeMode}
        selectedContext={selectedContext}
      />
    </div>
  )
}