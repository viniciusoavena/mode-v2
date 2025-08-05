"use client"

import { useMemo } from "react"

interface SmartGuidesProps {
  layers: any[]
  selectedLayerIds: string[]
  draggedLayer?: any
  zoom: number
  canvasWidth: number
  canvasHeight: number
  snapThreshold?: number
}

interface Guide {
  type: "vertical" | "horizontal"
  position: number
  start: number
  end: number
  color: string
  label?: string
}

export function SmartGuides({
  layers,
  selectedLayerIds,
  draggedLayer,
  zoom,
  canvasWidth,
  canvasHeight,
  snapThreshold = 5,
}: SmartGuidesProps) {
  const guides = useMemo(() => {
    if (!draggedLayer) return []

    const guides: Guide[] = []
    const otherLayers = layers.filter((layer) => !selectedLayerIds.includes(layer.id))

    // Canvas guides
    const canvasGuides = [
      // Vertical guides
      { type: "vertical" as const, position: 0, label: "Left edge" },
      { type: "vertical" as const, position: canvasWidth / 2, label: "Center" },
      { type: "vertical" as const, position: canvasWidth, label: "Right edge" },
      // Horizontal guides
      { type: "horizontal" as const, position: 0, label: "Top edge" },
      { type: "horizontal" as const, position: canvasHeight / 2, label: "Center" },
      { type: "horizontal" as const, position: canvasHeight, label: "Bottom edge" },
    ]

    // Check canvas alignment
    canvasGuides.forEach((guide) => {
      const threshold = snapThreshold / zoom

      if (guide.type === "vertical") {
        const layerLeft = draggedLayer.x
        const layerCenter = draggedLayer.x + draggedLayer.width / 2
        const layerRight = draggedLayer.x + draggedLayer.width

        if (
          Math.abs(layerLeft - guide.position) < threshold ||
          Math.abs(layerCenter - guide.position) < threshold ||
          Math.abs(layerRight - guide.position) < threshold
        ) {
          guides.push({
            type: "vertical",
            position: guide.position * zoom,
            start: 0,
            end: canvasHeight * zoom,
            color: "#3b82f6",
            label: guide.label,
          })
        }
      } else {
        const layerTop = draggedLayer.y
        const layerCenter = draggedLayer.y + draggedLayer.height / 2
        const layerBottom = draggedLayer.y + draggedLayer.height

        if (
          Math.abs(layerTop - guide.position) < threshold ||
          Math.abs(layerCenter - guide.position) < threshold ||
          Math.abs(layerBottom - guide.position) < threshold
        ) {
          guides.push({
            type: "horizontal",
            position: guide.position * zoom,
            start: 0,
            end: canvasWidth * zoom,
            color: "#3b82f6",
            label: guide.label,
          })
        }
      }
    })

    // Check alignment with other layers
    otherLayers.forEach((layer) => {
      const threshold = snapThreshold / zoom

      // Vertical alignment
      const positions = [
        { pos: layer.x, type: "left" },
        { pos: layer.x + layer.width / 2, type: "center" },
        { pos: layer.x + layer.width, type: "right" },
      ]

      positions.forEach(({ pos, type }) => {
        const layerLeft = draggedLayer.x
        const layerCenter = draggedLayer.x + draggedLayer.width / 2
        const layerRight = draggedLayer.x + draggedLayer.width

        if (
          Math.abs(layerLeft - pos) < threshold ||
          Math.abs(layerCenter - pos) < threshold ||
          Math.abs(layerRight - pos) < threshold
        ) {
          const minY = Math.min(layer.y, draggedLayer.y)
          const maxY = Math.max(layer.y + layer.height, draggedLayer.y + draggedLayer.height)

          guides.push({
            type: "vertical",
            position: pos * zoom,
            start: minY * zoom,
            end: maxY * zoom,
            color: "#ef4444",
          })
        }
      })

      // Horizontal alignment
      const hPositions = [
        { pos: layer.y, type: "top" },
        { pos: layer.y + layer.height / 2, type: "center" },
        { pos: layer.y + layer.height, type: "bottom" },
      ]

      hPositions.forEach(({ pos, type }) => {
        const layerTop = draggedLayer.y
        const layerCenter = draggedLayer.y + draggedLayer.height / 2
        const layerBottom = draggedLayer.y + draggedLayer.height

        if (
          Math.abs(layerTop - pos) < threshold ||
          Math.abs(layerCenter - pos) < threshold ||
          Math.abs(layerBottom - pos) < threshold
        ) {
          const minX = Math.min(layer.x, draggedLayer.x)
          const maxX = Math.max(layer.x + layer.width, draggedLayer.x + draggedLayer.width)

          guides.push({
            type: "horizontal",
            position: pos * zoom,
            start: minX * zoom,
            end: maxX * zoom,
            color: "#ef4444",
          })
        }
      })

      // Spacing guides
      const spacing = 20 // Default spacing
      const spacingThreshold = 2

      // Check horizontal spacing
      const rightEdge = layer.x + layer.width
      const leftEdge = layer.x
      const draggedLeft = draggedLayer.x
      const draggedRight = draggedLayer.x + draggedLayer.width

      if (Math.abs(draggedLeft - rightEdge - spacing) < spacingThreshold) {
        guides.push({
          type: "vertical",
          position: (rightEdge + spacing) * zoom,
          start: Math.min(layer.y, draggedLayer.y) * zoom,
          end: Math.max(layer.y + layer.height, draggedLayer.y + draggedLayer.height) * zoom,
          color: "#10b981",
        })
      }

      if (Math.abs(leftEdge - draggedRight - spacing) < spacingThreshold) {
        guides.push({
          type: "vertical",
          position: (draggedRight + spacing) * zoom,
          start: Math.min(layer.y, draggedLayer.y) * zoom,
          end: Math.max(layer.y + layer.height, draggedLayer.y + draggedLayer.height) * zoom,
          color: "#10b981",
        })
      }
    })

    return guides
  }, [layers, selectedLayerIds, draggedLayer, zoom, canvasWidth, canvasHeight, snapThreshold])

  if (guides.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      <svg width="100%" height="100%" className="absolute inset-0">
        {guides.map((guide, index) => (
          <g key={index}>
            {guide.type === "vertical" ? (
              <line
                x1={guide.position}
                y1={guide.start}
                x2={guide.position}
                y2={guide.end}
                stroke={guide.color}
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.8}
              />
            ) : (
              <line
                x1={guide.start}
                y1={guide.position}
                x2={guide.end}
                y2={guide.position}
                stroke={guide.color}
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.8}
              />
            )}
            {guide.label && (
              <text
                x={guide.type === "vertical" ? guide.position + 5 : guide.start + 5}
                y={guide.type === "vertical" ? guide.start + 15 : guide.position - 5}
                fill={guide.color}
                fontSize="10"
                className="font-mono"
              >
                {guide.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
