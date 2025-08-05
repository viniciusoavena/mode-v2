"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Calendar, Heart, Folder } from "lucide-react"

const personalStats = [
  {
    icon: Sparkles,
    label: "Total Creations",
    value: "47",
    change: "+5 this week",
    color: "text-primary",
  },
  {
    icon: Folder,
    label: "Projects",
    value: "12",
    change: "+2 this month",
    color: "text-blue-500",
  },
  {
    icon: Heart,
    label: "Favorites",
    value: "18",
    change: "38% of total",
    color: "text-red-500",
  },
  {
    icon: Calendar,
    label: "This Month",
    value: "8",
    change: "New creations",
    color: "text-green-500",
  },
]

export function PersonalGalleryStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {personalStats.map((stat) => (
        <Card key={stat.label} className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-muted/20 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground truncate">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
