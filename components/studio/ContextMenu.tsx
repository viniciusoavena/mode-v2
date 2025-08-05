"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Copy,
  Scissors,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  MoveUp,
  MoveDown,
  Download,
  Crop,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from "lucide-react"

interface ContextMenuProps {
  children: React.ReactNode
  layer?: any
  selectedLayers?: any[]
  onCopy?: () => void
  onCut?: () => void
  onPaste?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onToggleVisibility?: (id: string) => void
  onToggleLock?: (id: string) => void
  onMoveLayer?: (id: string, direction: "up" | "down") => void
  onAlign?: (type: string) => void
  onFlip?: (direction: "horizontal" | "vertical") => void
  onRotate?: (degrees: number) => void
  onCrop?: () => void
  onEdit?: () => void
  onDownload?: () => void
  onOpenSettings?: () => void
  canPaste?: boolean
  isCanvas?: boolean
}

export function LayerContextMenu({
  children,
  layer,
  selectedLayers = [],
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  onAlign,
  onFlip,
  onRotate,
  onCrop,
  onEdit,
  onDownload,
  onOpenSettings,
  canPaste = false,
  isCanvas = false,
}: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasSelection = selectedLayers.length > 0
  const hasMultipleSelection = selectedLayers.length > 1
  const isImageLayer = layer?.type === "image"

  // Prevent default context menu on right click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isOpen) {
        e.preventDefault()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    return () => document.removeEventListener("contextmenu", handleContextMenu)
  }, [isOpen])

  return (
    <ContextMenu onOpenChange={setIsOpen}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 glass-card">
        {/* Basic Actions */}
        {hasSelection && (
          <>
            <ContextMenuItem onClick={onCopy} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Copy
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={onCut} className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Cut
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
            </ContextMenuItem>
          </>
        )}

        {canPaste && (
          <ContextMenuItem onClick={onPaste} className="flex items-center gap-2">
            <Copy className="h-4 w-4 rotate-180" />
            Paste
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
          </ContextMenuItem>
        )}

        {hasSelection && (
          <>
            <ContextMenuItem onClick={onDuplicate} className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              Duplicate
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+D</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        )}

        {/* Layer-specific Actions */}
        {layer && (
          <>
            <ContextMenuItem onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Properties
            </ContextMenuItem>

            {isImageLayer && (
              <ContextMenuItem onClick={onCrop} className="flex items-center gap-2">
                <Crop className="h-4 w-4" />
                Crop Image
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />

            {/* Transform Submenu */}
            <ContextMenuSub>
              <ContextMenuSubTrigger className="flex items-center gap-2">
                <RotateCw className="h-4 w-4" />
                Transform
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => onRotate?.(90)} className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Rotate 90°
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onRotate?.(-90)} className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 scale-x-[-1]" />
                  Rotate -90°
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onRotate?.(180)} className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Rotate 180°
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onFlip?.("horizontal")} className="flex items-center gap-2">
                  <FlipHorizontal className="h-4 w-4" />
                  Flip Horizontal
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onFlip?.("vertical")} className="flex items-center gap-2">
                  <FlipVertical className="h-4 w-4" />
                  Flip Vertical
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>

            {/* Alignment Submenu */}
            {hasSelection && (
              <ContextMenuSub>
                <ContextMenuSubTrigger className="flex items-center gap-2">
                  <AlignCenter className="h-4 w-4" />
                  Align
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  <ContextMenuItem onClick={() => onAlign?.("left")} className="flex items-center gap-2">
                    <AlignLeft className="h-4 w-4" />
                    Align Left
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onAlign?.("center")} className="flex items-center gap-2">
                    <AlignCenter className="h-4 w-4" />
                    Align Center
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onAlign?.("right")} className="flex items-center gap-2">
                    <AlignRight className="h-4 w-4" />
                    Align Right
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => onAlign?.("top")} className="flex items-center gap-2">
                    <AlignVerticalJustifyStart className="h-4 w-4" />
                    Align Top
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onAlign?.("middle")} className="flex items-center gap-2">
                    <AlignVerticalJustifyCenter className="h-4 w-4" />
                    Align Middle
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => onAlign?.("bottom")} className="flex items-center gap-2">
                    <AlignVerticalJustifyEnd className="h-4 w-4" />
                    Align Bottom
                  </ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            )}

            <ContextMenuSeparator />

            {/* Layer Order */}
            <ContextMenuItem onClick={() => onMoveLayer?.(layer.id, "up")} className="flex items-center gap-2">
              <MoveUp className="h-4 w-4" />
              Bring Forward
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onMoveLayer?.(layer.id, "down")} className="flex items-center gap-2">
              <MoveDown className="h-4 w-4" />
              Send Backward
            </ContextMenuItem>

            <ContextMenuSeparator />

            {/* Visibility and Lock */}
            <ContextMenuItem onClick={() => onToggleVisibility?.(layer.id)} className="flex items-center gap-2">
              {layer.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {layer.visible ? "Hide Layer" : "Show Layer"}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onToggleLock?.(layer.id)} className="flex items-center gap-2">
              {layer.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {layer.locked ? "Unlock Layer" : "Lock Layer"}
            </ContextMenuItem>

            <ContextMenuSeparator />

            {/* Export */}
            <ContextMenuItem onClick={onDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Layer
            </ContextMenuItem>

            <ContextMenuSeparator />

            {/* Delete */}
            <ContextMenuItem onClick={onDelete} className="flex items-center gap-2 text-red-400 focus:text-red-300">
              <Trash2 className="h-4 w-4" />
              Delete Layer
              <span className="ml-auto text-xs text-muted-foreground">Del</span>
            </ContextMenuItem>
          </>
        )}

        {/* Canvas-only actions */}
        {isCanvas && !hasSelection && (
          <>
            <ContextMenuItem onClick={onPaste} disabled={!canPaste} className="flex items-center gap-2">
              <Copy className="h-4 w-4 rotate-180" />
              Paste
              <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onOpenSettings} className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Canvas Settings
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
