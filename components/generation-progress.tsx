"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Zap } from "lucide-react"

interface GenerationProgressProps {
  isGenerating: boolean
  mode: string
  context: string
  progress?: number
}

export function GenerationProgress({ isGenerating, mode, context, progress = 0 }: GenerationProgressProps) {
  if (!isGenerating) return null

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      {/* Animated Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-primary animate-spin" />
        </div>
        <div className="absolute -top-1 -right-1">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-bounce">
            <Zap className="w-3 h-3 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Generating {mode}...</h3>
        <p className="text-sm text-muted-foreground">Creating your {context.toLowerCase()} masterpiece</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs space-y-2">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Mode Badge */}
      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
        {mode} Mode
      </Badge>
    </div>
  )
}
