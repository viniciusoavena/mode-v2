"use client"

import type { Layer } from "@/app/types/layer-types"
import { cn } from "@/lib/utils"
import type { CSSProperties, MouseEvent } from "react"
import { useState, useEffect, useRef } from "react"

interface DraggableResizableLayerProps {
  layer: Layer
  isSelected: boolean
  zoom: number
  onSelect: (id: string, shiftKey: boolean) => void
  onUpdate: (id: string, updates: Partial<Layer>) => void
  onUpdateComplete: () => void
  canvasBounds: DOMRect | null
  isDraggable?: boolean
  style?: CSSProperties
}

const HANDLE_SIZE = 8

export function DraggableResizableLayer({
  layer,
  isSelected,
  zoom,
  onSelect,
  onUpdate,
  onUpdateComplete,
  canvasBounds,
  isDraggable = true,
  style = {},
}: DraggableResizableLayerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState<string | null>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startLayer, setStartLayer] = useState(layer)
  const layerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, handle?: string) => {
    if (layer.locked) return
    e.stopPropagation()
    onSelect(layer.id, e.shiftKey)

    if (handle) {
      setIsResizing(handle)
    } else if (isDraggable) {
      setIsDragging(true)
    }

    setStartPos({ x: e.clientX, y: e.clientY })
    setStartLayer(layer)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
      if (!isDragging && !isResizing) return

      const dx = (e.clientX - startPos.x) / zoom
      const dy = (e.clientY - startPos.y) / zoom

      let newProps: Partial<Layer> = {}

      if (isResizing) {
        let { x, y, width, height } = startLayer
        if (isResizing.includes("right")) width += dx
        if (isResizing.includes("left")) {
          x += dx
          width -= dx
        }
        if (isResizing.includes("bottom")) height += dy
        if (isResizing.includes("top")) {
          y += dy
          height -= dy
        }
        newProps = { x, y, width, height }
      } else if (isDragging) {
        newProps = { x: startLayer.x + dx, y: startLayer.y + dy }
      }
      
      onUpdate(layer.id, newProps)
    }

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        onUpdateComplete()
      }
      setIsDragging(false)
      setIsResizing(null)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, startPos, startLayer, zoom, onUpdate, onUpdateComplete, layer.id])

  const renderLayerContent = () => {
    switch (layer.type) {
      case "image":
        return (
          <img
            src={layer.imageUrl || "/placeholder.svg"}
            alt={layer.name}
            className="w-full h-full object-cover pointer-events-none"
          />
        )
      case "text":
        return (
          <div
            style={{
              fontSize: layer.fontSize,
              fontFamily: layer.fontFamily,
              fontWeight: layer.fontWeight as any,
              color: layer.fontColor,
              textAlign: layer.textAlign,
              fontStyle: layer.fontStyle,
              textDecoration: layer.textDecoration,
              lineHeight: layer.lineHeight,
              letterSpacing: layer.letterSpacing,
            }}
            className="w-full h-full flex items-center justify-center pointer-events-none"
          >
            {layer.content}
          </div>
        )
      default:
        return (
          <div className="w-full h-full bg-primary/20 border-2 border-dashed border-primary pointer-events-none" />
        )
    }
  }

  const handles = [
    "top-left", "top-center", "top-right",
    "middle-left", "middle-right",
    "bottom-left", "bottom-center", "bottom-right"
  ];

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute",
        !layer.locked && isDraggable && "cursor-move",
        isSelected && "outline outline-2 outline-primary outline-offset-2"
      )}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        transform: `rotate(${layer.rotation || 0}deg)`,
        opacity: layer.opacity,
        ...style,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderLayerContent()}
      {isSelected && !layer.locked && (
        <>
          {handles.map(handle => (
            <div
              key={handle}
              className="absolute bg-primary rounded-full"
              style={{
                top: handle.includes("top") ? -HANDLE_SIZE / 2 : handle.includes("bottom") ? `calc(100% - ${HANDLE_SIZE / 2}px)` : `calc(50% - ${HANDLE_SIZE / 2}px)`,
                left: handle.includes("left") ? -HANDLE_SIZE / 2 : handle.includes("right") ? `calc(100% - ${HANDLE_SIZE / 2}px)` : `calc(50% - ${HANDLE_SIZE / 2}px)`,
                width: HANDLE_SIZE,
                height: HANDLE_SIZE,
                cursor: `${handle.includes('top') || handle.includes('bottom') ? 'ns' : ''}${handle.includes('left') || handle.includes('right') ? 'ew' : ''}-resize`,
              }}
              onMouseDown={(e) => handleMouseDown(e, handle)}
            />
          ))}
        </>
      )}
    </div>
  )
}
