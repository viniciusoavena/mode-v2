import { useStudioStore } from "@/store/studio-store"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  MagnetIcon as Magic,
  ImageIcon,
  Video,
  Save,
  Undo2,
  Redo2,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Copy,
  Trash2,
  Group,
  Ungroup,
  Settings2,
  Layers,
} from "lucide-react"
import { useRef } from "react"
// --- INÍCIO DA CORREÇÃO ---
// 1. Importar o nosso componente de botão de autenticação centralizado
import { AuthButton } from "@/components/auth/auth-button"
// --- FIM DA CORREÇÃO ---

export type StudioMode = "image" | "video" | "motion"

interface StudioNavbarProps {
  onExport?: () => void
  onOpenCanvasSettings: () => void
}

export function StudioNavbar({
  onExport,
  onOpenCanvasSettings,
}: StudioNavbarProps) {
  const { 
    zoom, 
    history, 
    currentIndex, 
    undo, 
    redo, 
    zoomIn, 
    zoomOut, 
    resetZoom,
    addLayer,
    selectedLayerIds,
    duplicateSelectedLayers,
    deleteSelectedLayers,
    groupLayers,
    ungroupLayers,
    createMask,
    layers,
  } = useStudioStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1
  const zoomPercentage = Math.round(zoom * 100)

  const navItems = [
    { id: "image", label: "Image", icon: ImageIcon, soon: false },
    { id: "video", label: "Vídeo", icon: Video, soon: true },
  ]

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        addLayer({ type: 'image', imageUrl: reader.result as string, name: file.name })
      }
      reader.readAsDataURL(file)
      e.target.value = "" 
    }
  }

  return (
    <header className="relative z-50 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 pr-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-secondary to-primary">
            <Magic className="h-5 w-5 text-white" />
          </div>
          <h1 className="hidden sm:block text-lg font-semibold text-foreground">Mode</h1>
        </Link>
        <div className="flex items-center gap-1 rounded-full bg-background p-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={item.id === 'design' ? "secondary" : "ghost"}
              size="sm"
              className="rounded-full"
              disabled={item.soon}
              title={item.soon ? "Coming Soon" : ""}
            >
              <item.icon className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">{item.label}</span>
              {item.soon && <Badge variant="secondary" className="ml-2 !px-1.5 !py-0.5 text-xs">Soon</Badge>}
            </Button>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-1 rounded-full bg-background p-1">
        {/* ... (outros botões da barra de ferramentas permanecem os mesmos) ... */}
         <Button variant="ghost" size="icon" aria-label="Save" title="Save Project">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Import" onClick={handleImportClick} title="Import Image">
          <Upload className="h-4 w-4" />
        </Button>
        <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept="image/*" />
        <Button variant="ghost" size="icon" aria-label="Export" onClick={onExport} title="Export Canvas">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Canvas Settings" onClick={onOpenCanvasSettings} title="Canvas Settings">
            <Settings2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="ghost" size="icon" aria-label="Undo" onClick={undo} disabled={!canUndo} title="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Redo" onClick={redo} disabled={!canRedo} title="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="ghost" size="icon" aria-label="Duplicate" onClick={duplicateSelectedLayers} disabled={selectedLayerIds.length === 0} title="Duplicate Selection">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Group" onClick={groupLayers} disabled={selectedLayerIds.length < 2} title="Group Selection">
          <Group className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Create Mask" onClick={createMask} disabled={selectedLayerIds.length !== 2} title="Create Mask">
            <Layers className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Ungroup" onClick={ungroupLayers} disabled={selectedLayerIds.length !== 1 || layers.find(l => l.id === selectedLayerIds[0])?.type !== 'group'} title="Ungroup Selection">
          <Ungroup className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Delete" onClick={deleteSelectedLayers} disabled={selectedLayerIds.length === 0} title="Delete Selection">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 rounded-full bg-background p-1 text-sm font-medium">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <button
            className="w-12 text-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={resetZoom}
            title="Reset Zoom"
          >
            {zoomPercentage}%
          </button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        
        {/* --- INÍCIO DA CORREÇÃO --- */}
        {/* 2. Substituímos todo o DropdownMenu antigo pelo nosso componente centralizado */}
        <AuthButton />
        {/* --- FIM DA CORREÇÃO --- */}

      </div>
    </header>
  )
}