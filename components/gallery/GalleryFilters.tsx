"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { Grid3X3, LayoutGrid, Filter, Heart } from "lucide-react"
import { personalGalleryCategories, personalGalleryModes } from "@/lib/mock-gallery-data"

interface GalleryFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  selectedMode: string
  onModeChange: (mode: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "masonry"
  onViewModeChange: (mode: "grid" | "masonry") => void
  totalResults: number
  isPersonal?: boolean
}

export function GalleryFilters({
  selectedCategory,
  onCategoryChange,
  selectedMode,
  onModeChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
  isPersonal = false,
}: GalleryFiltersProps) {
  const categories = isPersonal ? personalGalleryCategories : personalGalleryCategories
  const modes = isPersonal ? personalGalleryModes : personalGalleryModes

  return (
    <div className="space-y-6 mb-8">
      {/* Category Filters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="rounded-full"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Mode Filters */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Content Type</h3>
        <div className="flex flex-wrap gap-2">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? "default" : "outline"}
              size="sm"
              onClick={() => onModeChange(mode.id)}
              className="rounded-full"
            >
              {mode.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {mode.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Filters for Personal Gallery */}
      {isPersonal && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Filters</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              <Heart className="w-4 h-4 mr-2" />
              Favorites
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              Recent Projects
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
              This Week
            </Button>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card/30 rounded-lg border border-border">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {isPersonal ? "Your creations: " : "Showing "}
            <span className="font-semibold text-foreground">{totalResults}</span>
            {isPersonal ? "" : " results"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Options */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              {isPersonal && <SelectItem value="favorites">Favorites First</SelectItem>}
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => value && onViewModeChange(value as "grid" | "masonry")}
            className="rounded-full bg-background p-1"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view" className="rounded-full">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="masonry" aria-label="Masonry view" className="rounded-full">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
