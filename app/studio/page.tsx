"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { StudioNavbar } from "@/components/studio/StudioNavbar"
import { LeftPanel } from "@/components/studio/LeftPanel"
import { RightPanel } from "@/components/studio/RightPanel"
import { CenterPanel } from "@/components/studio/CenterPanel"
import { useState, useEffect } from "react"
import { CanvasSettingsDialog } from "@/components/studio/CanvasSettingsDialog"
import { useStudioStore } from "@/store/studio-store"
import { useSearchParams, useRouter } from "next/navigation" // Hooks para ler e manipular o URL

export default function StudioPage() {
  const [activeStudio, setActiveStudio] = useState<"image" | "video" | "motion">("image")
  const [isCanvasSettingsOpen, setIsCanvasSettingsOpen] = useState(false)
  const [cropLayerId, setCropLayerId] = useState<string | null>(null)

  const { addLayer, layers, width, height, ...store } = useStudioStore()
  const searchParams = useSearchParams()
  const router = useRouter()

  // NOVO: Efeito para importar imagem do URL
  useEffect(() => {
    const imageUrl = searchParams.get("imageUrl")
    const imageWidth = searchParams.get("width")
    const imageHeight = searchParams.get("height")

    if (imageUrl) {
      addLayer({
        type: 'image',
        name: 'Imported from Discovery',
        imageUrl: decodeURIComponent(imageUrl),
        width: Number(imageWidth) || 512,
        height: Number(imageHeight) || 512,
        x: (width / 2) - (Number(imageWidth || 512) / 2), // Centraliza a nova camada
        y: (height / 2) - (Number(imageHeight || 512) / 2),
      })
      
      // Limpa os parâmetros do URL para evitar que a imagem seja adicionada novamente
      // ao recarregar a página.
      router.replace('/studio', { scroll: false });
    }
  }, [searchParams, addLayer, width, height, router]);

  // Lógica de atalhos do teclado (permanece a mesma)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault()
        store.deleteSelectedLayers()
      }
      // ... (outros atalhos)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [store.deleteSelectedLayers, store.duplicateSelectedLayers, store.groupLayers, store.ungroupLayers, store.selectLayer, layers])

  // Lógica de exportação (permanece a mesma)
  const handleComposeAndDownload = async () => {
    // ...
  }

  return (
    <>
      <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
        <StudioNavbar
          onExport={handleComposeAndDownload}
          onOpenCanvasSettings={() => setIsCanvasSettingsOpen(true)}
        />

        <main className="flex flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <LeftPanel />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60}>
              <CenterPanel cropLayerId={cropLayerId} setCropLayerId={setCropLayerId} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
              <RightPanel setCropLayerId={setCropLayerId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      <CanvasSettingsDialog
        isOpen={isCanvasSettingsOpen}
        onOpenChange={setIsCanvasSettingsOpen}
      />
    </>
  )
}