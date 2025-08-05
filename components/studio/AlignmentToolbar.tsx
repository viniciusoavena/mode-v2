"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AlignmentToolbarProps {
  onAlign: (alignment: string) => void
  onDistribute: (distribution: string) => void
  className?: string
}

const alignmentTools = [
  {
    id: "align-left",
    icon: <AlignHorizontalJustifyStart className="h-4 w-4" />,
    label: "Align Left",
  },
  {
    id: "align-center-horizontal",
    icon: <AlignHorizontalJustifyCenter className="h-4 w-4" />,
    label: "Align Center Horizontal",
  },
  {
    id: "align-right",
    icon: <AlignHorizontalJustifyEnd className="h-4 w-4" />,
    label: "Align Right",
  },
  { isSeparator: true },
  {
    id: "align-top",
    icon: <AlignVerticalJustifyStart className="h-4 w-4" />,
    label: "Align Top",
  },
  {
    id: "align-center-vertical",
    icon: <AlignVerticalJustifyCenter className="h-4 w-4" />,
    label: "Align Center Vertical",
  },
  {
    id: "align-bottom",
    icon: <AlignVerticalJustifyEnd className="h-4 w-4" />,
    label: "Align Bottom",
  },
  { isSeparator: true },
  {
    id: "distribute-horizontal",
    icon: <AlignHorizontalSpaceAround className="h-4 w-4" />,
    label: "Distribute Horizontally",
  },
  {
    id: "distribute-vertical",
    icon: <AlignVerticalSpaceAround className="h-4 w-4" />,
    label: "Distribute Vertically",
  },
]

export function AlignmentToolbar({ onAlign, onDistribute, className }: AlignmentToolbarProps) {
  const handleAction = (toolId: string) => {
    if (toolId.startsWith("distribute-")) {
      onDistribute(toolId)
    } else {
      onAlign(toolId)
    }
  }

  return (
    <div className={cn("absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-2 bg-card/80 rounded-lg backdrop-blur-sm border border-border shadow-lg", className)}>
      <TooltipProvider delayDuration={100}>
        {alignmentTools.map((tool, index) =>
          tool.isSeparator ? (
            <Separator key={`sep-${index}`} orientation="vertical" className="h-6 bg-border mx-1" />
          ) : (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => handleAction(tool.id!)}
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="bg-background/80 text-foreground border-border backdrop-blur-md"
              >
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ),
        )}
      </TooltipProvider>
    </div>
  )
}
