"use client"

import { useMemo } from "react"

interface CanvasGridProps {
  width: number
  height: number
  gridSize: number
  gridOpacity: number
  showGrid: boolean
  zoom: number
}

export function CanvasGrid({ width, height, gridSize, gridOpacity, showGrid, zoom }: CanvasGridProps) {
  const gridLines = useMemo(() => {
    if (!showGrid) return null

    const lines = []
    const scaledGridSize = gridSize * zoom
    const cols = Math.ceil(width / scaledGridSize)
    const rows = Math.ceil(height / scaledGridSize)

    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = i * scaledGridSize
      lines.push(
        <line
          key={`v-${i}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke="currentColor"
          strokeWidth={1}
          opacity={gridOpacity / 100}
        />,
      )
    }

    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = i * scaledGridSize
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke="currentColor"
          strokeWidth={1}
          opacity={gridOpacity / 100}
        />,
      )
    }

    return lines
  }, [width, height, gridSize, gridOpacity, showGrid, zoom])

  if (!showGrid) return null

  return (
    <svg
      className="absolute inset-0 pointer-events-none text-muted-foreground"
      width={width}
      height={height}
      style={{ zIndex: 1 }}
    >
      {gridLines}
    </svg>
  )
}
