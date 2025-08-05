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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStudioStore } from "@/store/studio-store"
import { Settings2 } from "lucide-react"
import { useState } from "react"

const CANVAS_PRESETS = [
    { name: "Custom", width: 1000, height: 1000 },
    { name: "Instagram Post", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Facebook Post", width: 1200, height: 630 },
    { name: "Twitter Header", width: 1500, height: 500 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
]

interface CanvasSettingsDialogProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function CanvasSettingsDialog({ isOpen, onOpenChange }: CanvasSettingsDialogProps) {
  const { width, height, setCanvasSize } = useStudioStore()
  const [selectedPreset, setSelectedPreset] = useState("Custom")

  const handlePresetChange = (presetName: string) => {
    const preset = CANVAS_PRESETS.find((p) => p.name === presetName)
    if (preset) {
      setCanvasSize(preset.width, preset.height)
      setSelectedPreset(presetName)
    }
  }

  const handleCustomDimensions = (newWidth: number, newHeight: number) => {
    setCanvasSize(newWidth, newHeight)
    setSelectedPreset("Custom")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card/80 backdrop-blur-xl border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" /> Canvas Settings
          </DialogTitle>
          <DialogDescription>
            Configure your canvas dimensions and choose from popular presets.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <Label htmlFor="canvas-preset" className="text-muted-foreground mb-2 block">
              Canvas Presets
            </Label>
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {CANVAS_PRESETS.map((preset) => (
                  <SelectItem key={preset.name} value={preset.name}>
                    <div className="flex justify-between items-center w-full">
                      <span>{preset.name}</span>
                      <span className="text-xs text-muted-foreground ml-4">
                        {preset.width} × {preset.height}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="canvas-width" className="text-muted-foreground mb-1 block">
                Width (px)
              </Label>
              <Input
                id="canvas-width"
                type="number"
                value={width}
                onChange={(e) => handleCustomDimensions(Number(e.target.value) || 1000, height)}
                className="bg-background border-border"
                min="100"
                max="10000"
              />
            </div>
            <div>
              <Label htmlFor="canvas-height" className="text-muted-foreground mb-1 block">
                Height (px)
              </Label>
              <Input
                id="canvas-height"
                type="number"
                value={height}
                onChange={(e) => handleCustomDimensions(width, Number(e.target.value) || 1000)}
                className="bg-background border-border"
                min="100"
                max="10000"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
