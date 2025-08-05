// store/slices/ui-slice.ts
import type { StateCreator } from 'zustand'
import type { UiSlice } from './slices-types'

export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = (set) => ({
  creativeMode: 'branding',
  resourceType: 'Logo',
  modifiers: {},
  editingLayerId: null, // Estado inicial
  setCreativeMode: (mode) => set({ creativeMode: mode }),
  setResourceType: (type) => set({ resourceType: type }),
  setModifier: (key, value) => set((state) => ({ modifiers: { ...state.modifiers, [key]: value } })),
  removeModifier: (key) => set((state) => {
      const newModifiers = { ...state.modifiers };
      delete newModifiers[key];
      return { modifiers: newModifiers };
    }),
  setEditingLayerId: (id) => set({ editingLayerId: id }), // Nova ação
});