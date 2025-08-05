"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { RotateCcw } from "lucide-react"

interface SelectionBoxProps {
  layer: any
  isSelected: boolean
  onUpdate: (id: string, updates: any) => void
  onSelect: (id: string) => void
  zoom: number
  snapToGrid?: boolean
  gridSize?: number
}

type ResizeHandle =
  | "top-left"
  | "top-center"
  | "top-right"
  | "middle-left"
  | "middle-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export function SelectionBox({
  layer,
  isSelected,
  onUpdate,
  onSelect,
  zoom,
  snapToGrid = false,
  gridSize = 20,
}: SelectionBoxProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<ResizeHandle | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [initialBounds, setInitialBounds] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [initialRotation, setInitialRotation] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)

  const snapToGridValue = useCallback(
    (value: number) => {
      if (!snapToGrid) return value
      return Math.round(value / gridSize) * gridSize
    },
    [snapToGrid, gridSize],
  )

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget) return // Prevent drag when clicking handles

      e.preventDefault()
      e.stopPropagation()

      onSelect(layer.id)
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialBounds({ x: layer.x, y: layer.y, width: layer.width, height: layer.height })
    },
    [layer, onSelect],
  )

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.preventDefault()
      e.stopPropagation()

      setIsResizing(handle)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialBounds({ x: layer.x, y: layer.y, width: layer.width, height: layer.height })
    },
    [layer],
  )

  // Handle rotation start
  const handleRotationStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setIsRotating(true)
      setDragStart({ x: e.clientX, y: e.clientY })
      setInitialRotation(layer.rotation || 0)
    },
    [layer],
  )

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        const newX = snapToGridValue(initialBounds.x + deltaX)
        const newY = snapToGridValue(initialBounds.y + deltaY)

        onUpdate(layer.id, { x: newX, y: newY })
      } else if (isResizing) {
        const deltaX = (e.clientX - dragStart.x) / zoom
        const deltaY = (e.clientY - dragStart.y) / zoom

        const newBounds = { ...initialBounds }

        switch (isResizing) {
          case "top-left":
            newBounds.x = snapToGridValue(initialBounds.x + deltaX)
            newBounds.y = snapToGridValue(initialBounds.y + deltaY)
            newBounds.width = Math.max(20, initialBounds.width - deltaX)
            newBounds.height = Math.max(20, initialBounds.height - deltaY)
            break
          case "top-center":
            newBounds.y = snapToGridValue(initialBounds.y + deltaY)
            newBounds.height = Math.max(20, initialBounds.height - deltaY)
            break
          case "top-right":
            newBounds.y = snapToGridValue(initialBounds.y + deltaY)
            newBounds.width = Math.max(20, initialBounds.width + deltaX)
            newBounds.height = Math.max(20, initialBounds.height - deltaY)
            break
          case "middle-left":
            newBounds.x = snapToGridValue(initialBounds.x + deltaX)
            newBounds.width = Math.max(20, initialBounds.width - deltaX)
            break
          case "middle-right":
            newBounds.width = Math.max(20, initialBounds.width + deltaX)
            break
          case "bottom-left":
            newBounds.x = snapToGridValue(initialBounds.x + deltaX)
            newBounds.width = Math.max(20, initialBounds.width - deltaX)
            newBounds.height = Math.max(20, initialBounds.height + deltaY)
            break
          case "bottom-center":
            newBounds.height = Math.max(20, initialBounds.height + deltaY)
            break
          case "bottom-right":
            newBounds.width = Math.max(20, initialBounds.width + deltaX)
            newBounds.height = Math.max(20, initialBounds.height + deltaY)
            break
        }

        onUpdate(layer.id, newBounds)
      } else if (isRotating) {
        const rect = elementRef.current?.getBoundingClientRect()
        if (rect) {
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI)
          const newRotation = Math.round((initialRotation + angle) / 15) * 15 // Snap to 15° increments

          onUpdate(layer.id, { rotation: newRotation })
        }
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(null)
      setIsRotating(false)
    }

    if (isDragging || isResizing || isRotating) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = isDragging ? "move" : isResizing ? "resize" : "grab"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = "default"
      }
    }
  }, [
    isDragging,
    isResizing,
    isRotating,
    dragStart,
    initialBounds,
    initialRotation,
    layer.id,
    onUpdate,
    zoom,
    snapToGridValue,
  ])

  if (!isSelected) return null

  const handleStyle =
    "absolute w-2 h-2 bg-primary border border-background rounded-sm hover:scale-125 transition-transform cursor-pointer"
  const cornerHandleStyle = handleStyle + " border-2"

  return (
    <div
      ref={elementRef}
      className="absolute pointer-events-none"
      style={{
        left: `${layer.x * zoom}px`,
        top: `${layer.y * zoom}px`,
        width: `${layer.width * zoom}px`,
        height: `${layer.height * zoom}px`,
        transform: `rotate(${layer.rotation || 0}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Selection Border */}
      <div className="absolute inset-0 border-2 border-primary border-dashed pointer-events-none" />

      {/* Resize Handles */}
      {/* Corner Handles */}
      <div
        className={cornerHandleStyle + " -top-1 -left-1 cursor-nw-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "top-left")}
      />
      <div
        className={cornerHandleStyle + " -top-1 -right-1 cursor-ne-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "top-right")}
      />
      <div
        className={cornerHandleStyle + " -bottom-1 -left-1 cursor-sw-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "bottom-left")}
      />
      <div
        className={cornerHandleStyle + " -bottom-1 -right-1 cursor-se-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "bottom-right")}
      />

      {/* Edge Handles */}
      <div
        className={handleStyle + " -top-1 left-1/2 -translate-x-1/2 cursor-n-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "top-center")}
      />
      <div
        className={handleStyle + " -bottom-1 left-1/2 -translate-x-1/2 cursor-s-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "bottom-center")}
      />
      <div
        className={handleStyle + " -left-1 top-1/2 -translate-y-1/2 cursor-w-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "middle-left")}
      />
      <div
        className={handleStyle + " -right-1 top-1/2 -translate-y-1/2 cursor-e-resize"}
        style={{ pointerEvents: "auto" }}
        onMouseDown={(e) => handleResizeStart(e, "middle-right")}
      />

      {/* Rotation Handle */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-grab hover:scale-110 transition-transform"
        style={{ pointerEvents: "auto" }}
        onMouseDown={handleRotationStart}
      >
        <RotateCcw className="w-3 h-3 text-primary-foreground" />
      </div>

      {/* Rotation Line */}
      <div className="absolute -top-8 left-1/2 w-px h-6 bg-primary -translate-x-1/2" />

      {/* Drag Area (invisible overlay) */}
      <div className="absolute inset-0 cursor-move" style={{ pointerEvents: "auto" }} onMouseDown={handleMouseDown} />
    </div>
  )
}
