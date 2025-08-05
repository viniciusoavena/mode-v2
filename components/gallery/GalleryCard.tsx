"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Download, Edit, Copy, Trash2, Play, Sparkles, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { PersonalGalleryItem } from "@/lib/mock-gallery-data"

interface GalleryCardProps {
  item: PersonalGalleryItem
  viewMode: "grid" | "masonry"
  isPersonal?: boolean
}

export function GalleryCard({ item, viewMode, isPersonal = false }: GalleryCardProps) {
  const [isFavorite, setIsFavorite] = useState(item.isFavorite)

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  const getModeIcon = () => {
    switch (item.mode) {
      case "video":
        return <Play className="w-4 h-4" />
      case "motion":
        return <Sparkles className="w-4 h-4" />
      default:
        return null
    }
  }

  const getModeColor = () => {
    switch (item.mode) {
      case "video":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "motion":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    }
  }

  return (
    <Card
      className={`group overflow-hidden border-border bg-card/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${viewMode === "masonry" ? "break-inside-avoid" : ""}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Badge */}
        {isFavorite && (
          <Badge className="absolute top-3 left-3 bg-red-500/90 text-white">
            <Heart className="w-3 h-3 mr-1 fill-current" />
            Favorite
          </Badge>
        )}

        {/* Mode Badge */}
        <Badge className={`absolute top-3 right-3 ${getModeColor()}`}>
          <div className="flex items-center gap-1">
            {getModeIcon()}
            <span className="capitalize">{item.mode}</span>
          </div>
        </Badge>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="secondary" className="bg-white/90 text-black hover:bg-white">
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Title and Description */}
        <div className="mb-3">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        </div>

        {/* Project */}
        {item.project && (
          <div className="mb-3">
            <Badge variant="outline" className="text-xs bg-transparent">
              📁 {item.project}
            </Badge>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-transparent">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-transparent">
              +{item.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Creation Info */}
        <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          <span>{item.model}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-1 text-sm transition-colors ${
                isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
            <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground p-1">
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit in Studio
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 focus:text-red-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Prompt Preview */}
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-2">
            <span className="font-medium">Prompt:</span> {item.prompt}
          </p>
        </div>

        {/* Technical Details */}
        <div className="mt-2 text-xs text-muted-foreground">
          <span>
            {item.settings.width}×{item.settings.height} • {item.settings.steps} steps • Seed: {item.settings.seed}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
