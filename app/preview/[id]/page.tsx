"use client"

import { useState } from "react"
import { StudioNavbar } from "@/components/studio/StudioNavbar"
import { LeftPanel } from "@/components/studio/LeftPanel"
import { RightPanel } from "@/components/studio/RightPanel"
import { CenterPanel } from "@/components/studio/CenterPanel"
import { SignUpModal } from "@/components/auth/SignUpModal"
import { mockPersonalGalleryData } from "@/lib/mock-gallery-data" // Usamos os dados mockados
import { useSearchParams } from 'next/navigation'
import { useEffect } from "react"
import { useStudioStore } from "@/store/studio-store"

export default function PreviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const searchParams = useSearchParams()
  const { addLayer, setLayers } = useStudioStore()

  useEffect(() => {
    // Limpa quaisquer camadas existentes ao entrar no modo de preview
    setLayers([]);

    const imageUrl = searchParams.get("imageUrl")
    const imageWidth = searchParams.get("width")
    const imageHeight = searchParams.get("height")
    
    if (imageUrl) {
      addLayer({
        type: 'image',
        name: 'Preview Image',
        imageUrl: decodeURIComponent(imageUrl),
        width: Number(imageWidth) || 1024,
        height: Number(imageHeight) || 1024,
        x: 50,
        y: 50,
        locked: true, // Bloqueia a camada no modo preview
      })
    }
  }, [searchParams, addLayer, setLayers])


  return (
    <>
      <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
        {/* Adiciona um overlay que, quando clicado, abre o modal de registo */}
        <div 
            className="absolute inset-0 z-40" 
            onClick={() => setIsModalOpen(true)}
        />
        
        {/* Renderiza a UI do estúdio por baixo do overlay */}
        <StudioNavbar onExport={() => {}} onOpenCanvasSettings={() => {}} />
        <main className="flex flex-1 overflow-hidden pointer-events-none"> {/* pointer-events-none para desativar cliques */}
            <div className="w-[20%] min-w-[250px]"><LeftPanel /></div>
            <div className="flex-1"><CenterPanel cropLayerId={null} setCropLayerId={() => {}} /></div>
            <div className="w-[20%] min-w-[250px]"><RightPanel setCropLayerId={() => {}} /></div>
        </main>
      </div>

      <SignUpModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}