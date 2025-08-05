"use client"

import { Button } from "@/components/ui/button"
import { 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  Heart, 
  Hexagon
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  } from "@/components/ui/dialog"

interface ShapeSelectorProps {
  onShapeSelect: (shapeType: "rectangle" | "circle" | "triangle" | "star" | "heart" | "hexagon") => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

const shapes = [
  { type: "rectangle", icon: <Square /> },
  { type: "circle", icon: <Circle /> },
  { type: "triangle", icon: <Triangle /> },
  { type: "star", icon: <Star /> },
  { type: "heart", icon: <Heart /> },
  { type: "hexagon", icon: <Hexagon /> },
] as const

export function ShapeSelector({ onShapeSelect, open, onOpenChange }: ShapeSelectorProps) {
  const handleSelect = (shapeType: "rectangle" | "circle" | "triangle" | "star" | "heart" | "hexagon") => {
    onShapeSelect(shapeType)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] bg-card/80 backdrop-blur-xl border-border text-foreground">
            <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                    <Square className="h-5 w-5" /> Select Shape
                </DialogTitle>
                <DialogDescription>
                    Choose a shape to add to your canvas.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 p-4">
            {shapes.map((shape) => (
                <Button
                key={shape.type}
                variant="outline"
                className="flex flex-col h-20 items-center justify-center gap-2"
                onClick={() => handleSelect(shape.type)}
                >
                {shape.icon}
                <span className="text-xs capitalize">{shape.type}</span>
                </Button>
            ))}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}
