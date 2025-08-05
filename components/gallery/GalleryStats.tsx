"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Eye, Heart, Users, Sparkles } from "lucide-react"

const stats = [
  {
    icon: Sparkles,
    label: "Total Creations",
    value: "12,847",
    change: "+23%",
    color: "text-primary",
  },
  {
    icon: Users,
    label: "Active Creators",
    value: "3,421",
    change: "+12%",
    color: "text-blue-500",
  },
  {
    icon: Heart,
    label: "Total Likes",
    value: "89,234",
    change: "+18%",
    color: "text-red-500",
  },
  {
    icon: Eye,
    label: "Total Views",
    value: "1.2M",
    change: "+31%",
    color: "text-green-500",
  },
]

export function GalleryStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/50 border-border">
          <CardContent className="p-4 flex items-center">
            <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
