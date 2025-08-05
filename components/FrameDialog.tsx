"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Frame } from "lucide-react"

interface FrameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFrame: (width: number, height: number) => void
}

export function FrameDialog({ open, onOpenChange, onCreateFrame }: FrameDialogProps) {
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(200)

  const handleCreate = () => {
    onCreateFrame(width, height)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card/80 backdrop-blur-xl border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Frame className="h-5 w-5" /> Create Custom Frame
          </DialogTitle>
          <DialogDescription>
            Set the dimensions for your new frame.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frame-width" className="text-muted-foreground mb-1 block">
                Width (px)
              </Label>
              <Input
                id="frame-width"
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value) || 200)}
                className="bg-background border-border"
              />
            </div>
            <div>
              <Label htmlFor="frame-height" className="text-muted-foreground mb-1 block">
                Height (px)
              </Label>
              <Input
                id="frame-height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 200)}
                className="bg-background border-border"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCreate}>Create Frame</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
