import type { StateCreator } from 'zustand'
import type { CanvasSlice } from './slices-types'

export const createCanvasSlice: StateCreator<
  CanvasSlice,
  [],
  [],
  CanvasSlice
> = (set) => ({
  zoom: 1,
  panX: 0,
  panY: 0,
  width: 1024,
  height: 768,
  gridSize: 20,
  gridOpacity: 0.15,
  showGrid: true,
  snapToGrid: true,
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom * 1.2, 5) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom / 1.2, 0.1) })),
  resetZoom: () => set({ zoom: 1, panX: 0, panY: 0 }),
  setCanvasSize: (width, height) => set({ width, height }),
  setGridSize: (size) => set({ gridSize: size }),
  setGridOpacity: (opacity) => set({ gridOpacity: opacity }),
  toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
})