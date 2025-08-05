"use client"

import type { Layer } from "@/app/types/layer-types"
import { cn } from "@/lib/utils"
import type { CSSProperties, MouseEvent } from "react"
// ... (outros imports)

// ...

export function DraggableResizableLayer({
  layer,
  isSelected,
  zoom,
  onSelect,
  onUpdate,
  onUpdateComplete,
  canvasBounds,
  isDraggable = true,
  style = {},
}: DraggableResizableLayerProps) {
  
  // ... (toda a lógica de arrastar e redimensionar permanece a mesma)

  // --- INÍCIO DA ATUALIZAÇÃO ---
  // Constrói os estilos CSS com base nas novas propriedades
  const layerStyles: CSSProperties = {
    left: layer.x,
    top: layer.y,
    width: layer.width,
    height: layer.height,
    transform: `rotate(${layer.rotation || 0}deg)`,
    opacity: layer.opacity,
    mixBlendMode: layer.blendMode || 'normal', // Aplica o modo de mesclagem
    ...style,
  };

  // Aplica filtros para as camadas de ajuste
  if (layer.type === 'adjustment' && layer.adjustmentValues) {
    const filters = [];
    const { brightness, contrast, hue, saturation } = layer.adjustmentValues;
    if (brightness) filters.push(`brightness(${100 + brightness}%)`);
    if (contrast) filters.push(`contrast(${100 + contrast}%)`);
    if (hue) filters.push(`hue-rotate(${hue}deg)`);
    if (saturation) filters.push(`saturate(${100 + saturation}%)`);
    layerStyles.filter = filters.join(' ');
    // Camadas de ajuste afetam tudo o que está por baixo
    layerStyles.pointerEvents = 'none'; 
  }
  // --- FIM DA ATUALIZAÇÃO ---

  const renderLayerContent = () => {
    // Para camadas de ajuste, renderizamos um placeholder visual
    if (layer.type === 'adjustment') {
        return <div className="w-full h-full backdrop-filter" style={{...layerStyles}} />;
    }
    // ... (resto da lógica de renderização)
  }

  return (
    <div
      ref={layerRef}
      className={cn(
        "absolute",
        !layer.locked && isDraggable && "cursor-move",
        isSelected && "outline outline-2 outline-primary outline-offset-2"
      )}
      style={layerStyles} // Usa os novos estilos
      onMouseDown={handleMouseDown}
    >
      {renderLayerContent()}
      {/* ... (renderização das alças de redimensionamento) */}
    </div>
  )
}