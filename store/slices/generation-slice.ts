import { StateCreator } from 'zustand';
import { StudioState, GenerationSlice, Quality } from './slices-types';

export const createGenerationSlice: StateCreator<
  StudioState,
  [],
  [],
  GenerationSlice
> = (set, get) => ({
  isGenerating: false,
  error: null,
  prompt: '',
  quality: 'med', // Valor inicial padrão
  variations: [],
  selectedVariation: null,

  setPrompt: (prompt) => set({ prompt }),
  setQuality: (quality) => set({ quality }),

  startGeneration: (prompt) =>
    set({
      isGenerating: true,
      prompt,
      error: null,
      variations: [],
      selectedVariation: null,
    }),

  generateImage: async () => { // Removido 'options' pois todos os dados vêm do 'get()'
    // --- INÍCIO DA CORREÇÃO ---
    // Pega TODOS os dados necessários do estado global, incluindo os 'modifiers'.
    const { prompt, quality, modifiers, creativeMode, resourceType } = get();
    // --- FIM DA CORREÇÃO ---

    // Validação para garantir que não enviamos uma requisição vazia
    if (!prompt || !creativeMode || !resourceType) {
        console.error("Tentativa de geração com dados em falta:", { prompt, creativeMode, resourceType });
        set({ isGenerating: false, error: "Modo Criativo, Contexto e Prompt são necessários." });
        return;
    }
    
    get().startGeneration(prompt);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_prompt: prompt,
          creative_mode: creativeMode,
          context: resourceType,
          modifiers: modifiers || {}, // GARANTE que os modifiers sejam enviados
          quality: quality,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || errData.error || "A geração da imagem falhou.");
      }

      const result = await response.json();
      
      const newImage = result.images[0];

      get().addLayer({
        type: "image",
        name: `AI: ${prompt.substring(0, 20)}...`,
        imageUrl: newImage.url,
        width: newImage.width || 1024,
        height: newImage.height || 1024,
        x: 50,
        y: 50,
      });

      set({ isGenerating: false, error: null });

    } catch (err: any) {
      const errorMessage = err.message || "Ocorreu um erro desconhecido.";
      console.error("Falha na geração:", errorMessage);
      set({ isGenerating: false, error: errorMessage });
    }
  },

  setVariations: (variations) => set({ isGenerating: false, variations }),
  selectVariation: (variation) => set({ selectedVariation: variation }),
});