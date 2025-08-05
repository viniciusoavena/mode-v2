"use client"

import { create } from 'zustand'
import type {
  CanvasSlice,
  GenerationSlice,
  HistorySlice,
  LayersSlice,
  UiSlice,
} from './slices/slices-types'
import { createLayersSlice } from './slices/layers-slice'
import { createCanvasSlice } from './slices/canvas-slice'
import { createHistorySlice } from './slices/history-slice'
import { createGenerationSlice } from './slices/generation-slice'
import { createUiSlice } from './slices/ui-slice'

export type StudioState = LayersSlice &
  CanvasSlice &
  HistorySlice &
  GenerationSlice &
  UiSlice

export const useStudioStore = create<StudioState>()((...a) => ({
  ...createLayersSlice(...a),
  ...createCanvasSlice(...a),
  ...createHistorySlice(...a),
  ...createGenerationSlice(...a),
  ...createUiSlice(...a),
}))
