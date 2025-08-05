import type { StateCreator } from 'zustand'
import type { HistorySlice, HistoryEntry } from './slices-types'
import type { LayersSlice } from './slices-types' // Import to access layers state

export const createHistorySlice: StateCreator<
  HistorySlice & LayersSlice, // Needs access to layers to save them
  [],
  [],
  HistorySlice
> = (set, get) => ({
  history: [],
  currentIndex: -1,
  addAction: () => {
    const currentLayers = get().layers
    const newEntry: HistoryEntry = {
      layers: JSON.parse(JSON.stringify(currentLayers)), // Deep copy
    }

    set((state) => {
      const newHistory = [
        ...state.history.slice(0, state.currentIndex + 1),
        newEntry,
      ]
      return {
        history: newHistory,
        currentIndex: newHistory.length - 1,
      }
    })
  },
  undo: () => {
    const { currentIndex, history } = get()
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      const previousState = history[newIndex]
      set({
        layers: JSON.parse(JSON.stringify(previousState.layers)), // Deep copy
        currentIndex: newIndex,
      })
    }
  },
  redo: () => {
    const { currentIndex, history } = get()
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      const nextState = history[newIndex]
      set({
        layers: JSON.parse(JSON.stringify(nextState.layers)), // Deep copy
        currentIndex: newIndex,
      })
    }
  },
})
