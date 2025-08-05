"use client"

import { useStudioStore } from "@/store/studio-store"
import { useCallback, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Layer, BlendMode } from "@/app/types/layer-types"
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Italic, Underline, Strikethrough,
  RotateCcw, EyeOff, Eye, Lock, Trash2, Crop, FlipHorizontal,
} from "lucide-react"

// Lista de modos de mesclagem para o dropdown
const blendModes: { value: BlendMode; label: string }[] = [
    { value: 'normal', label: 'Normal' }, { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' }, { value: 'overlay', label: 'Overlay' },
    { value: 'darken', label: 'Darken' }, { value: 'lighten', label: 'Lighten' },
    { value: 'color-dodge', label: 'Color Dodge' }, { value: 'color-burn', label: 'Color Burn' },
    { value: 'hard-light', label: 'Hard Light' }, { value: 'soft-light', label: 'Soft Light' },
    { value: 'difference', label: 'Difference' }, { value: 'exclusion', label: 'Exclusion' },
    { value: 'hue', label: 'Hue' }, { value: 'saturation', label: 'Saturation' },
    { value: 'color', label: 'Color' }, { value: 'luminosity', label: 'Luminosity' },
];

export function AdjustPanel({ setCropLayerId }: { setCropLayerId: (id: string | null) => void }) {
  const { layers, selectedLayerIds, updateLayer } = useStudioStore()

  const selectedLayers = useMemo(() => {
    return layers.filter((l) => selectedLayerIds.includes(l.id))
  }, [layers, selectedLayerIds])

  if (selectedLayers.length === 0) {
    return (
      <div className="p-3">
        <h3 className="text-base font-semibold">Ajustar Propriedades</h3>
        <p className="text-sm text-muted-foreground mt-2">Selecione uma camada para ajustar as suas propriedades.</p>
        <Accordion type="single" collapsible defaultValue="grid-settings" className="w-full mt-4">
            <AccordionItem value="grid-settings">
                <AccordionTrigger>Definições da Grelha</AccordionTrigger>
                <AccordionContent><GridSettingsSection /></AccordionContent>
            </AccordionItem>
        </Accordion>
      </div>
    )
  }

  if (selectedLayers.length > 1) {
    return <MultiSelectAdjustPanel selectedLayers={selectedLayers} />
  }

  const selectedLayer = selectedLayers[0]

  if (selectedLayer.type === 'adjustment') {
      return <AdjustmentLayerPanel layer={selectedLayer} />
  }

  return (
    <Accordion type="multiple" defaultValue={["layer-style", "transform"]} className="w-full p-3">
      <AccordionItem value="layer-style">
        <AccordionTrigger>Estilo da Camada</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">Opacidade</Label>
            <Slider
              value={[(selectedLayer.opacity ?? 1) * 100]}
              onValueChange={([value]) => updateLayer(selectedLayer.id, { opacity: value / 100 })}
              max={100} step={1} disabled={selectedLayer.locked}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Modo de Mesclagem</Label>
            <Select
              value={selectedLayer.blendMode || 'normal'}
              onValueChange={(value: BlendMode) => updateLayer(selectedLayer.id, { blendMode: value })}
              disabled={selectedLayer.locked}
            >
              <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {blendModes.map(mode => <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="transform">
        <AccordionTrigger>Transformar</AccordionTrigger>
        <AccordionContent className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nome da Camada</Label>
            <Input
              value={selectedLayer.name}
              onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
              className="bg-background border-border"
              disabled={selectedLayer.locked}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Rotação</Label>
            <Input
              type="number"
              value={selectedLayer.rotation || 0}
              onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) || 0 })}
              className="bg-background border-border"
              disabled={selectedLayer.locked}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
      
      {selectedLayer.type === "image" && (
        <AccordionItem value="image-properties">
          <AccordionTrigger>Propriedades da Imagem</AccordionTrigger>
          <AccordionContent>
            <ImagePropertiesSection 
              selectedLayer={selectedLayer} 
              onPropertyChange={(prop, val) => updateLayer(selectedLayer.id, {[prop]: val})}
              onCrop={() => setCropLayerId(selectedLayer.id)}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {selectedLayer.type === "text" && (
        <AccordionItem value="text-properties">
          <AccordionTrigger>Propriedades do Texto</AccordionTrigger>
          <AccordionContent>
            <TextPropertiesSection selectedLayer={selectedLayer} onPropertyChange={(prop, val) => updateLayer(selectedLayer.id, {[prop]: val})} />
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="quick-actions">
        <AccordionTrigger>Ações Rápidas</AccordionTrigger>
        <AccordionContent>
          <QuickActionsSection selectedLayer={selectedLayer} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

// ==============================================================================
// SUB-COMPONENTES COMPLETOS
// ==============================================================================

function MultiSelectAdjustPanel({ selectedLayers }: { selectedLayers: Layer[] }) {
    const { updateLayer, deleteSelectedLayers, toggleLayerLock } = useStudioStore()
    const allLocked = selectedLayers.every(l => l.locked)

    const handleMultiPropertyChange = (property: keyof Layer, value: any) => {
        selectedLayers.forEach(layer => {
            updateLayer(layer.id, { [property]: value })
        })
    }

    return (
        <div className="p-3">
        <h3 className="text-base font-semibold mb-4">{selectedLayers.length} camadas selecionadas</h3>
        <Accordion type="multiple" defaultValue={["transform", "quick-actions"]} className="w-full">
            <AccordionItem value="transform">
            <AccordionTrigger>Transformar</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
                <div className="space-y-3">
                <Label className="text-sm font-medium">Opacidade</Label>
                <Slider
                    onValueChange={([value]) => handleMultiPropertyChange("opacity", value / 100)}
                    max={100}
                    step={1}
                    disabled={allLocked}
                />
                </div>
                <div className="space-y-2">
                <Label className="text-sm font-medium">Rotação</Label>
                <Input
                    type="number"
                    onChange={(e) => handleMultiPropertyChange("rotation", Number(e.target.value) || 0)}
                    className="bg-background border-border"
                    placeholder="Misto"
                    disabled={allLocked}
                />
                </div>
            </AccordionContent>
            </AccordionItem>
            <AccordionItem value="quick-actions">
            <AccordionTrigger>Ações Rápidas</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => selectedLayers.forEach(l => toggleLayerLock(l.id))}>
                <Lock className="h-4 w-4 mr-2" /> {allLocked ? "Desbloquear Todas" : "Bloquear Todas"}
                </Button>
                <Button variant="destructive" size="sm" className="w-full justify-start" onClick={deleteSelectedLayers}>
                <Trash2 className="h-4 w-4 mr-2" /> Apagar Todas
                </Button>
            </AccordionContent>
            </AccordionItem>
        </Accordion>
        </div>
    )
}

function AdjustmentLayerPanel({ layer }: { layer: Layer }) {
    const { updateLayer } = useStudioStore();
    const values = layer.adjustmentValues || {};

    const handleValueChange = (key: string, value: number) => {
        updateLayer(layer.id, {
            adjustmentValues: { ...values, [key]: value }
        });
    }

    return (
        <div className="p-3 space-y-4">
             <h3 className="text-base font-semibold">{layer.name}</h3>
             {layer.adjustmentType === 'brightness-contrast' && (
                 <>
                    <div className="space-y-2">
                        <Label>Brilho: {values.brightness || 0}</Label>
                        <Slider value={[values.brightness || 0]} min={-100} max={100} step={1} onValueChange={([v]) => handleValueChange('brightness', v)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Contraste: {values.contrast || 0}</Label>
                        <Slider value={[values.contrast || 0]} min={-100} max={100} step={1} onValueChange={([v]) => handleValueChange('contrast', v)} />
                    </div>
                 </>
             )}
              {layer.adjustmentType === 'hue-saturation' && (
                 <>
                    <div className="space-y-2">
                        <Label>Matiz: {values.hue || 0}°</Label>
                        <Slider value={[values.hue || 0]} min={0} max={360} step={1} onValueChange={([v]) => handleValueChange('hue', v)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Saturação: {values.saturation || 0}</Label>
                        <Slider value={[values.saturation || 0]} min={-100} max={100} step={1} onValueChange={([v]) => handleValueChange('saturation', v)} />
                    </div>
                 </>
             )}
        </div>
    )
}

function ImagePropertiesSection({ selectedLayer, onPropertyChange, onCrop }: { selectedLayer: Layer; onPropertyChange: (prop: keyof Layer, value: any) => void; onCrop: () => void; }) {
    return (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">URL da Imagem</Label>
            <Input
              value={selectedLayer.imageUrl || ""}
              onChange={(e) => onPropertyChange("imageUrl", e.target.value)}
              className="bg-background border-border"
              disabled={selectedLayer.locked}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs justify-start bg-transparent" onClick={onCrop} disabled={selectedLayer.locked}>
              <Crop className="h-3 w-3 mr-1" />
              Cortar
            </Button>
            <Button variant="outline" size="sm" className="text-xs justify-start bg-transparent" disabled>
              <FlipHorizontal className="h-3 w-3 mr-1" />
              Inverter (brevemente)
            </Button>
          </div>
        </div>
    )
}

function TextPropertiesSection({ selectedLayer, onPropertyChange }: { selectedLayer: Layer; onPropertyChange: (prop: keyof Layer, value: any) => void; }) {
    const fontOptions = [ { value: "Inter", label: "Inter" }, { value: "Arial", label: "Arial" }, { value: "Helvetica", label: "Helvetica" }, { value: "Times New Roman", label: "Times New Roman" }, ];
    const fontWeightOptions = [ { value: "300", label: "Light" }, { value: "normal", label: "Normal" }, { value: "500", label: "Medium" }, { value: "bold", label: "Bold" }, { value: "800", label: "Extra Bold" }, ];

    return (
        <div className="space-y-4 pt-2">
            <Textarea
                value={selectedLayer.content || ""}
                onChange={(e) => onPropertyChange("content", e.target.value)}
                className="bg-background border-border resize-none min-h-[80px]"
                placeholder="Introduza o seu texto..."
                disabled={selectedLayer.locked}
            />
            <div className="grid grid-cols-2 gap-3">
                <Select value={selectedLayer.fontFamily || "Inter"} onValueChange={(v) => onPropertyChange("fontFamily", v)} disabled={selectedLayer.locked}>
                <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{fontOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={selectedLayer.fontSize || 24} onChange={(e) => onPropertyChange("fontSize", Number(e.target.value))} disabled={selectedLayer.locked} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Select value={selectedLayer.fontWeight || "normal"} onValueChange={(v) => onPropertyChange("fontWeight", v)} disabled={selectedLayer.locked}>
                <SelectTrigger className="bg-background border-border"><SelectValue /></SelectTrigger>
                <SelectContent>{fontWeightOptions.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="color" value={selectedLayer.fontColor || "#ffffff"} onChange={(e) => onPropertyChange("fontColor", e.target.value)} className="p-1 h-10" disabled={selectedLayer.locked} />
            </div>
            <div className="flex gap-2">
                <ToggleGroup type="single" value={selectedLayer.fontStyle} onValueChange={(v) => onPropertyChange("fontStyle", v)} className="w-full" disabled={selectedLayer.locked}>
                <ToggleGroupItem value="italic" className="flex-1"><Italic className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup type="single" value={selectedLayer.textDecoration} onValueChange={(v) => onPropertyChange("textDecoration", v)} className="w-full" disabled={selectedLayer.locked}>
                <ToggleGroupItem value="underline" className="flex-1"><Underline className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="line-through" className="flex-1"><Strikethrough className="h-4 w-4" /></ToggleGroupItem>
                </ToggleGroup>
            </div>
            <ToggleGroup type="single" value={selectedLayer.textAlign || "left"} onValueChange={(v) => v && onPropertyChange("textAlign", v as any)} className="w-full grid grid-cols-4" disabled={selectedLayer.locked}>
                <ToggleGroupItem value="left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                <ToggleGroupItem value="justify"><AlignJustify className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
        </div>
    )
}

function QuickActionsSection({ selectedLayer }: { selectedLayer: Layer }) {
    const { deleteSelectedLayers, toggleLayerLock, toggleLayerVisibility } = useStudioStore();
    return (
        <div className="space-y-2 pt-2">
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toggleLayerVisibility(selectedLayer.id)}>
                {selectedLayer.visible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {selectedLayer.visible ? "Esconder" : "Mostrar"}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={() => toggleLayerLock(selectedLayer.id)}>
                <Lock className="h-4 w-4 mr-2" />
                {selectedLayer.locked ? "Desbloquear" : "Bloquear"}
            </Button>
            <Button variant="destructive" size="sm" className="w-full justify-start" onClick={deleteSelectedLayers}>
                <Trash2 className="h-4 w-4 mr-2" /> Apagar
            </Button>
        </div>
    )
}

function GridSettingsSection() {
    const { showGrid, snapToGrid, gridSize, gridOpacity, toggleShowGrid, toggleSnapToGrid, setGridSize, setGridOpacity } = useStudioStore()
    return (
        <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Mostrar Grelha</Label>
                <Button size="sm" variant={showGrid ? "secondary" : "outline"} onClick={toggleShowGrid}>Alternar</Button>
            </div>
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Ajustar à Grelha</Label>
                <Button size="sm" variant={snapToGrid ? "secondary" : "outline"} onClick={toggleSnapToGrid}>Alternar</Button>
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-medium">Tamanho da Grelha: {gridSize}px</Label>
                <Slider value={[gridSize]} min={10} max={100} step={5} onValueChange={([val]) => setGridSize(val)} />
            </div>
            <div className="space-y-2">
                <Label className="text-sm font-medium">Opacidade da Grelha: {Math.round(gridOpacity*100)}%</Label>
                <Slider value={[gridOpacity*100]} min={5} max={50} step={1} onValueChange={([val]) => setGridOpacity(val/100)} />
            </div>
        </div>
    )
}