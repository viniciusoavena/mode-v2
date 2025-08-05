"use client"

import type { Layer } from "@/app/types/layer-types"
import { useState, type MouseEvent } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface CropOverlayProps {
  layer: Layer
  zoom: number
  onCrop: (cropData: { x: number; y: number; width: number; height: number }) => void
  onCancel: () => void
}

export function CropOverlay({ layer, zoom, onCrop, onCancel }: CropOverlayProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 1, height: 1 }) // Values are percentages
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startCrop, setStartCrop] = useState({ x: 0, y: 0, width: 1, height: 1 })
  const [resizingHandle, setResizingHandle] = useState<string | null>(null)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>, handle: string) => {
    e.stopPropagation()
    setResizingHandle(handle)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartCrop(crop)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!resizingHandle) return
    e.stopPropagation()

    const dx = (e.clientX - startPos.x) / (layer.width * zoom)
    const dy = (e.clientY - startPos.y) / (layer.height * zoom)

    setCrop(prev => {
        let { x, y, width, height } = startCrop;

        if (resizingHandle.includes('right')) width += dx;
        if (resizingHandle.includes('left')) {
            x += dx;
            width -= dx;
        }
        if (resizingHandle.includes('bottom')) height += dy;
        if (resizingHandle.includes('top')) {
            y += dy;
            height -= dy;
        }

        // Clamp values between 0 and 1
        x = Math.max(0, x);
        y = Math.max(0, y);
        width = Math.min(1 - x, width);
        height = Math.min(1 - y, height);

        return { x, y, width, height };
    });
  }

  const handleMouseUp = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setResizingHandle(null)
  }

  const cropBoxStyle = {
    left: `${crop.x * 100}%`,
    top: `${crop.y * 100}%`,
    width: `${crop.width * 100}%`,
    height: `${crop.height * 100}%`,
  }

  const handles = [
    "top-left", "top-center", "top-right",
    "middle-left", "middle-right",
    "bottom-left", "bottom-center", "bottom-right"
  ];

  return (
    <div
      className="absolute inset-0 bg-black/50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute border-2 border-dashed border-white"
        style={cropBoxStyle}
      >
        {handles.map(handle => (
            <div
                key={handle}
                onMouseDown={(e) => handleMouseDown(e, handle)}
                className={`absolute w-3 h-3 bg-white rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                style={{
                    top: `${handle.includes('top') ? '0%' : handle.includes('bottom') ? '100%' : '50%'}`,
                    left: `${handle.includes('left') ? '0%' : handle.includes('right') ? '100%' : '50%'}`,
                }}
            />
        ))}
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button size="icon" onClick={() => onCrop(crop)} className="bg-green-600 hover:bg-green-700">
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="destructive" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
