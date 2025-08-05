
import type { Layer } from '@/app/types/layer-types'
import type { StateCreator } from 'zustand'

// Canvas Slice
export interface CanvasState {
  zoom: number
  panX: number
  panY: number
  width: number
  height: number
  gridSize: number
  gridOpacity: number
  showGrid: boolean
  snapToGrid: boolean
}

export interface CanvasActions {
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  setCanvasSize: (width: number, height: number) => void
  setGridSize: (size: number) => void
  setGridOpacity: (opacity: number) => void
  toggleShowGrid: () => void
  toggleSnapToGrid: () => void
}

export type CanvasSlice = CanvasState & CanvasActions

// Generation Slice
export interface GenerationState {
  isGenerating: boolean
  prompt: string
  variations: string[]
  selectedVariation: string | null
}

export interface GenerationActions {
  startGeneration: (prompt: string) => void
  setVariations: (variations: string[]) => void
  selectVariation: (variation: string | null) => void
}

import type { Quality } from './generation-slice'

// ... (o resto do arquivo permanece o mesmo até GenerationSlice)

export type GenerationSlice = {
  isGenerating: boolean
  error: string | null
  prompt: string
  quality: Quality
  variations: any[] // Defina um tipo melhor se souber a estrutura
  selectedVariation: any | null
  setPrompt: (prompt: string) => void
  setQuality: (quality: Quality) => void
  startGeneration: (prompt: string) => void
  generateImage: (options: {
    prompt: string
    mode: string
    context: string
    quality: Quality
  }) => Promise<void>
  setVariations: (variations: any[]) => void
  selectVariation: (variation: any) => void
}

// History Slice
export type HistoryEntry = {
  layers: Layer[]
  // Potentially add other state parts to history if needed
}

export interface HistoryState {
  history: HistoryEntry[]
  currentIndex: number
}

export interface HistoryActions {
  addAction: (entry: HistoryEntry) => void
  undo: () => void
  redo: () => void
}

export type HistorySlice = HistoryState & HistoryActions

// Layers Slice
export interface LayersState {
  layers: Layer[]
  selectedLayerIds: string[]
}

export interface LayersActions {
  setLayers: (layers: Layer[]) => void
  addLayer: (layer: Partial<Layer>) => void
  updateLayer: (layerId: string, updatedProperties: Partial<Layer>) => void
  selectLayer: (layerId: string, shiftKey?: boolean) => void
  deleteSelectedLayers: () => void
  duplicateSelectedLayers: () => void
  moveLayer: (layerId: string, newIndex: number) => void
  reorderLayers: (draggedId: string, targetId: string) => void
  toggleLayerVisibility: (layerId: string) => void
  toggleLayerLock: (layerId: string) => void
  groupLayers: () => void
  ungroupLayers: () => void
  createMask: () => void
  releaseMask: () => void
}

export type LayersSlice = LayersState & LayersActions

// UI Slice
export interface UiState {
  creativeMode: boolean
  selectedContext: string | null // e.g., 'text', 'image', 'canvas'
}

export interface UiActions {
  setCreativeMode: (mode: boolean) => void
  setSelectedContext: (context: string | null) => void
}

export type UiSlice = {
  creativeMode: string
  resourceType: string | null
  setCreativeMode: (mode: string) => void
  setResourceType: (type: string | null) => void
}


export type UiSlice = {
  creativeMode: string
  resourceType: string | null
  modifiers: Record<string, any> // NOVO
  setCreativeMode: (mode: string) => void
  setResourceType: (type: string | null) => void
  setModifier: (key: string, value: any) => void // NOVO
  removeModifier: (key: string) => void // NOVO
}

export type UiSlice = {
  creativeMode: string
  resourceType: string | null
  modifiers: Record<string, any> // NOVO
  setCreativeMode: (mode: string) => void
  setResourceType: (type: string | null) => void
  setModifier: (key: string, value: any) => void // NOVO
  removeModifier: (key: string) => void // NOVO
}

export type UiSlice = {
  creativeMode: string
  resourceType: string | null
  modifiers: Record<string, any>
  editingLayerId: string | null // NOVO: ID da camada em modo de edição
  setCreativeMode: (mode: string) => void
  setResourceType: (type: string | null) => void
  setModifier: (key: string, value: any) => void
  removeModifier: (key: string) => void
  setEditingLayerId: (id: string | null) => void // NOVO: Ação para definir a camada
}
