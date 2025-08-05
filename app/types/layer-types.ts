export type LayerType = "image" | "text" | "group" | "frame" | "shape" | "adjustment"

export type MaskType = "raster" | "vector"

// Define os modos de mesclagem disponíveis (baseado em CSS)
export type BlendMode =
  | "normal" | "multiply" | "screen" | "overlay" | "darken" | "lighten"
  | "color-dodge" | "color-burn" | "hard-light" | "soft-light" | "difference"
  | "exclusion" | "hue" | "saturation" | "color" | "luminosity"

// Define os tipos de ajuste disponíveis
export type AdjustmentType = "brightness-contrast" | "hue-saturation"

export interface Layer {
  id: string
  name: string
  type: LayerType
  visible: boolean
  locked: boolean
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  opacity: number
  rotation: number
  
  // Propriedade para modos de mesclagem
  blendMode?: BlendMode 

  // Propriedades para camadas de ajuste
  adjustmentType?: AdjustmentType
  adjustmentValues?: {
    brightness?: number // ex: -100 a 100
    contrast?: number   // ex: -100 a 100
    hue?: number        // ex: 0 a 360
    saturation?: number // ex: -100 a 100
  }

  // Propriedades de Texto
  content?: string
  fontSize?: number
  fontFamily?: string
  fontStyle?: "normal" | "italic"
  fontWeight?: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"
  fontColor?: string
  textAlign?: "left" | "center" | "right" | "justify"
  textDecoration?: "none" | "underline" | "line-through"
  lineHeight?: number
  letterSpacing?: number

  // Propriedades de Imagem
  imageUrl?: string
  
  // Propriedades de Forma
  color?: string
  shapeType?: "rectangle" | "circle" | "triangle" | "star" | "heart" | "hexagon"
  
  // Propriedades de Grupo
  children?: string[]
  expanded?: boolean

  // Propriedades de Máscara
  isMask?: boolean
  maskedBy?: string
  maskType?: MaskType

  // Propriedades de Frame
  frameStyle?: string
}