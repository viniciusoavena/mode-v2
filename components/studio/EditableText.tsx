"use client"

import { useStudioStore } from "@/store/studio-store";
import { useEffect, useRef } from "react";
import type { Layer } from "@/app/types/layer-types";

export function EditableText({ layer, zoom }: { layer: Layer, zoom: number }) {
  const { updateLayer, setEditingLayerId } = useStudioStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Foca e seleciona todo o texto quando o componente aparece
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  const handleBlur = () => {
    setEditingLayerId(null); // Sai do modo de edição quando o foco é perdido
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateLayer(layer.id, { content: e.target.value });
  };

  return (
    <textarea
      ref={textareaRef}
      value={layer.content || ""}
      onBlur={handleBlur}
      onChange={handleChange}
      className="absolute bg-transparent text-white outline-none resize-none overflow-hidden"
      style={{
        left: layer.x * zoom,
        top: layer.y * zoom,
        width: layer.width * zoom,
        height: layer.height * zoom,
        transform: `rotate(${layer.rotation || 0}deg)`,
        transformOrigin: 'top left',
        fontSize: (layer.fontSize || 24) * zoom,
        fontFamily: layer.fontFamily || 'Inter',
        color: layer.fontColor || '#FFFFFF',
        textAlign: layer.textAlign || 'left',
        fontWeight: layer.fontWeight || 'normal',
        fontStyle: layer.fontStyle || 'normal',
        lineHeight: layer.lineHeight || 1.2,
        letterSpacing: `${layer.letterSpacing || 0}px`,
        padding: 0,
        zIndex: 1000, // Garante que a textarea fique por cima de tudo
      }}
    />
  );
}