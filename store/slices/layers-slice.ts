import { StateCreator } from 'zustand'
import { produce } from 'immer'
import type { LayersSlice } from './slices-types'
import type { Layer, MaskType } from '@/app/types/layer-types'

export const createLayersSlice: StateCreator<
  LayersSlice,
  [],
  [],
  LayersSlice
> = (set, get) => ({
  layers: [],
  selectedLayerIds: [],
  setLayers: (layers) => {
    set({ layers, selectedLayerIds: [] })
  },
  addLayer: (layer) => {
    const newLayerId = layer.id || `layer-${Date.now()}`
    
    // --- INÍCIO DA CORREÇÃO ---
    // Define valores padrão específicos para cada tipo de camada
    let defaultProps: Partial<Layer> = {};
    if (layer.type === 'text') {
      defaultProps = {
        content: "New Text",
        fontSize: 48,
        fontFamily: "Inter",
        fontColor: "#FFFFFF",
        textAlign: "center"
      };
    }
    // --- FIM DA CORREÇÃO ---

    const newLayer: Layer = {
      id: newLayerId,
      name: layer.name || `Layer ${get().layers.length + 1}`,
      type: layer.type,
      visible: true,
      locked: false,
      x: 50,
      y: 50,
      width: 300, // Largura padrão maior para texto
      height: 100, // Altura padrão maior para texto
      zIndex: get().layers.length,
      opacity: 1,
      rotation: 0,
      ...defaultProps, // Aplica os padrões específicos do tipo
      ...layer,
    }
    set(
      produce((state: LayersSlice) => {
        state.layers.push(newLayer)
        state.selectedLayerIds = [newLayerId]
      }),
    )
  },
  updateLayer: (layerId, updatedProperties) => {
    set(
      produce((state: LayersSlice) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          Object.assign(layer, updatedProperties)
        }
      }),
    )
  },
  selectLayer: (layerId, shiftKey = false) => {
    set(
      produce((state: LayersSlice) => {
        if (!layerId) {
          state.selectedLayerIds = [];
          return;
        }

        if (shiftKey) {
          if (state.selectedLayerIds.includes(layerId)) {
            state.selectedLayerIds = state.selectedLayerIds.filter((id) => id !== layerId)
          } else {
            state.selectedLayerIds.push(layerId)
          }
        } else {
          state.selectedLayerIds = [layerId]
        }
      }),
    )
  },
  deleteSelectedLayers: () => {
    set(
      produce((state: LayersSlice) => {
        state.layers = state.layers.filter((l) => !state.selectedLayerIds.includes(l.id))
        state.selectedLayerIds = []
      }),
    )
  },
  duplicateSelectedLayers: () => {
    set(
      produce((state: LayersSlice) => {
        const selectedLayers = state.layers.filter((l) => state.selectedLayerIds.includes(l.id))
        const newLayers: Layer[] = []
        const newSelectedIds: string[] = []

        selectedLayers.forEach((layer) => {
          const newId = `${layer.type}-${Date.now()}`
          const newLayer: Layer = {
            ...layer,
            id: newId,
            name: `${layer.name} Copy`,
            x: layer.x + 20,
            y: layer.y + 20,
            zIndex: state.layers.length + newLayers.length,
          }
          newLayers.push(newLayer)
          newSelectedIds.push(newId)
        })

        state.layers.push(...newLayers)
        state.selectedLayerIds = newSelectedIds
      }),
    )
  },
  reorderLayers: (draggedId, targetId) => {
    set(
        produce((state: LayersSlice) => {
            const draggedIndex = state.layers.findIndex(l => l.id === draggedId);
            const targetIndex = state.layers.findIndex(l => l.id === targetId);

            if (draggedIndex === -1 || targetIndex === -1) return;

            const [draggedItem] = state.layers.splice(draggedIndex, 1);
            state.layers.splice(targetIndex, 0, draggedItem);

            state.layers.forEach((l, index) => {
                l.zIndex = state.layers.length - 1 - index;
            });
        })
    )
  },
  toggleLayerVisibility: (layerId) => {
    set(
      produce((state: LayersSlice) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.visible = !layer.visible
        }
      }),
    )
  },
  toggleLayerLock: (layerId) => {
    set(
      produce((state: LayersSlice) => {
        const layer = state.layers.find((l) => l.id === layerId)
        if (layer) {
          layer.locked = !layer.locked
        }
      }),
    )
  },
  groupLayers: () => {
    set(
      produce((state: LayersSlice) => {
        const selectedLayers = state.layers.filter((l) => state.selectedLayerIds.includes(l.id));
        if (selectedLayers.length < 2) return;

        const minX = Math.min(...selectedLayers.map((l) => l.x));
        const minY = Math.min(...selectedLayers.map((l) => l.y));
        const maxX = Math.max(...selectedLayers.map((l) => l.x + l.width));
        const maxY = Math.max(...selectedLayers.map((l) => l.y + l.height));
        const maxZIndex = Math.max(...selectedLayers.map((l) => l.zIndex ?? 0));

        const groupId = `group-${Date.now()}`;
        const groupLayer: Layer = {
          id: groupId,
          name: `Group ${state.layers.filter((l) => l.type === 'group').length + 1}`,
          type: 'group',
          visible: true,
          locked: false,
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
          zIndex: maxZIndex + 1,
          opacity: 1,
          rotation: 0,
          children: state.selectedLayerIds,
        };

        state.layers.push(groupLayer);
        state.selectedLayerIds.forEach(id => {
            const layer = state.layers.find(l => l.id === id);
            if(layer) layer.visible = false;
        });
        state.selectedLayerIds = [groupId];
      }),
    );
  },
  ungroupLayers: () => {
    set(
      produce((state: LayersSlice) => {
        const selectedGroups = state.layers.filter(
          (l) => state.selectedLayerIds.includes(l.id) && l.type === 'group'
        ) as Layer[];

        if (selectedGroups.length === 0) return;

        const newSelectedIds: string[] = [];
        selectedGroups.forEach((group) => {
          group.children?.forEach((childId) => {
            const child = state.layers.find((l) => l.id === childId);
            if (child) {
              child.visible = true;
              newSelectedIds.push(childId);
            }
          });
        });
        
        state.layers = state.layers.filter((l) => !state.selectedLayerIds.includes(l.id));
        state.selectedLayerIds = newSelectedIds;
      }),
    );
  },
  createMask: (maskType: MaskType) => {
    set(
      produce((state: LayersSlice) => {
        const selectedLayers = state.layers
          .filter(l => state.selectedLayerIds.includes(l.id))
          .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0));
        
        if (selectedLayers.length !== 2) return;

        const maskLayer = selectedLayers[0];
        const contentLayer = selectedLayers[1];

        maskLayer.isMask = true;
        maskLayer.maskType = maskType; 
        contentLayer.maskedBy = maskLayer.id;
        
        maskLayer.name = `${maskType.charAt(0).toUpperCase() + maskType.slice(1)} Mask`;
        
        state.selectedLayerIds = [contentLayer.id];
      })
    )
  },
  releaseMask: () => {
    set(
      produce((state: LayersSlice) => {
        const contentLayer = state.layers.find(l => state.selectedLayerIds.includes(l.id) && l.maskedBy);
        if (!contentLayer) return;

        const maskLayer = state.layers.find(l => l.id === contentLayer.maskedBy);
        
        if (maskLayer) {
            maskLayer.isMask = false;
            maskLayer.maskType = undefined;
        }
        
        contentLayer.maskedBy = undefined;
        state.selectedLayerIds = [contentLayer.id];
      })
    )
  },
})