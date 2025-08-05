import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FormSectionProps {
  title: string
  description: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function FormSection({ title, description, icon, children }: FormSectionProps) {
  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon && <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">{icon}</div>}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
