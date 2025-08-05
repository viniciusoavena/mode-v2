"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"

interface MultiSelectionProps {
  onSelectionChange: (selectedIds: string[]) => void
  layers: any[]
  zoom: number
  canvasRef: React.RefObject<HTMLDivElement>
}

export function MultiSelection({ onSelectionChange, layers, zoom, canvasRef }: MultiSelectionProps) {
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start selection if clicking on empty canvas
      if (e.target !== e.currentTarget) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      setCanvasOffset({ x: rect.left, y: rect.top })
      setSelectionStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setSelectionEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setIsSelecting(true)
    },
    [canvasRef],
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isSelecting) return

      setSelectionEnd({
        x: e.clientX - canvasOffset.x,
        y: e.clientY - canvasOffset.y,
      })
    }

    const handleMouseUp = () => {
      if (!isSelecting) return

      // Calculate selection bounds
      const minX = Math.min(selectionStart.x, selectionEnd.x) / zoom
      const maxX = Math.max(selectionStart.x, selectionEnd.x) / zoom
      const minY = Math.min(selectionStart.y, selectionEnd.y) / zoom
      const maxY = Math.max(selectionStart.y, selectionEnd.y) / zoom

      // Find layers within selection
      const selectedLayers = layers.filter((layer) => {
        const layerRight = layer.x + layer.width
        const layerBottom = layer.y + layer.height

        return layer.x < maxX && layerRight > minX && layer.y < maxY && layerBottom > minY
      })

      onSelectionChange(selectedLayers.map((layer) => layer.id))
      setIsSelecting(false)
    }

    if (isSelecting) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isSelecting, selectionStart, selectionEnd, canvasOffset, layers, zoom, onSelectionChange])

  const selectionBox = {
    left: Math.min(selectionStart.x, selectionEnd.x),
    top: Math.min(selectionStart.y, selectionEnd.y),
    width: Math.abs(selectionEnd.x - selectionStart.x),
    height: Math.abs(selectionEnd.y - selectionStart.y),
  }

  return (
    <>
      {/* Selection Area */}
      <div className="absolute inset-0 cursor-crosshair" onMouseDown={handleMouseDown} />

      {/* Selection Box */}
      {isSelecting && (
        <div
          className="absolute border border-primary bg-primary/10 pointer-events-none"
          style={{
            left: `${selectionBox.left}px`,
            top: `${selectionBox.top}px`,
            width: `${selectionBox.width}px`,
            height: `${selectionBox.height}px`,
          }}
        />
      )}
    </>
  )
}
