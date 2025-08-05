"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Save, Upload, Shield, Palette, Trash2 } from "lucide-react"
import { FormSection } from "@/components/profile/FormSection"

export function ProfileSettings() {
  const [settings, setSettings] = useState({
    // Personal Info
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex@example.com",

    // Preferences
    theme: "dark",
    language: "en",
    emailNotifications: true,
    profilePublic: true,
    showGenerations: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("Saving settings:", settings)
  }

  return (
    <div className="flex justify-center w-full">
      <div className="space-y-8 max-w-3xl w-full">
        {/* ---------- Personal Information --------- */}
        <FormSection
          title="Personal Information"
          description="Update your personal details and profile information."
          icon={<Shield className="w-4 h-4 text-primary" />}
        >
          {/* Profile Picture */}
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20 border-2 border-border">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-r from-secondary to-primary text-white">
                AJ
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </Button>
                <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300 bg-transparent">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 2&nbsp;MB. Recommended 400×400&nbsp;px.
              </p>
            </div>
          </div>

          <Separator />

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={settings.firstName}
                onChange={(e) => handleSettingChange("firstName", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={settings.lastName}
                onChange={(e) => handleSettingChange("lastName", e.target.value)}
                className="bg-background border-border"
              />
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleSettingChange("email", e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <Separator />

          {/* Change Password */}
          <div className="space-y-4">
            <h4 className="font-medium">Account Security</h4>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </FormSection>

        {/* ---------- Preferences --------- */}
        <FormSection
          title="Preferences"
          description="Customize your experience and interface preferences."
          icon={<Palette className="w-4 h-4 text-primary" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about your account activity via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
              </div>
              <Switch
                checked={settings.profilePublic}
                onCheckedChange={(checked) => handleSettingChange("profilePublic", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Generations</Label>
                <p className="text-sm text-muted-foreground">Allow others to see your public generations</p>
              </div>
              <Switch
                checked={settings.showGenerations}
                onCheckedChange={(checked) => handleSettingChange("showGenerations", checked)}
              />
            </div>
          </div>
        </FormSection>

        {/* ---------- Save Button --------- */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
