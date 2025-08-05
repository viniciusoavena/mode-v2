export interface PersonalGalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: "social" | "marketing" | "branding" | "web" | "print" | "ecommerce"
  mode: "image" | "video" | "motion"
  createdAt: string
  tags: string[]
  prompt: string
  isFavorite: boolean
  project?: string
  model: string
  settings: {
    width: number
    height: number
    steps: number
    seed: number
  }
}

export const mockPersonalGalleryData: PersonalGalleryItem[] = [
  {
    id: "1",
    title: "Brand Logo Concept",
    description: "Modern minimalist logo design for tech startup",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: "branding",
    mode: "image",
    createdAt: "2025-01-15T10:30:00Z",
    tags: ["logo", "branding", "minimalist", "tech"],
    prompt:
      "Modern minimalist logo design for tech startup, clean typography, geometric shapes, blue and white color scheme",
    isFavorite: true,
    project: "TechCorp Branding",
    model: "Mode 1.0 High",
    settings: {
      width: 1024,
      height: 1024,
      steps: 50,
      seed: 123456,
    },
  },
  {
    id: "2",
    title: "Instagram Story Template",
    description: "Vibrant story template for product launch",
    imageUrl: "/placeholder.svg?height=800&width=450",
    category: "social",
    mode: "image",
    createdAt: "2025-01-14T15:45:00Z",
    tags: ["instagram", "story", "product", "launch"],
    prompt:
      "Vibrant Instagram story template for product launch, gradient background, modern typography, call-to-action button",
    isFavorite: false,
    project: "Product Launch Campaign",
    model: "Mode 1.0 Med",
    settings: {
      width: 1080,
      height: 1920,
      steps: 30,
      seed: 789012,
    },
  },
  {
    id: "3",
    title: "Website Hero Banner",
    description: "Professional hero section for landing page",
    imageUrl: "/placeholder.svg?height=400&width=800",
    category: "web",
    mode: "image",
    createdAt: "2025-01-13T09:20:00Z",
    tags: ["web", "hero", "landing", "professional"],
    prompt:
      "Professional website hero banner, clean design, corporate feel, technology theme, call-to-action prominent",
    isFavorite: true,
    project: "Company Website",
    model: "Mode 1.0 High",
    settings: {
      width: 1920,
      height: 1080,
      steps: 40,
      seed: 345678,
    },
  },
  {
    id: "4",
    title: "Product Showcase Video",
    description: "Animated product presentation",
    imageUrl: "/placeholder.svg?height=400&width=600",
    category: "marketing",
    mode: "video",
    createdAt: "2025-01-12T14:15:00Z",
    tags: ["product", "video", "animation", "showcase"],
    prompt:
      "Product showcase video with smooth animations, professional lighting, 360-degree rotation, clean background",
    isFavorite: false,
    project: "Product Marketing",
    model: "Mode Video 1.0",
    settings: {
      width: 1920,
      height: 1080,
      steps: 25,
      seed: 901234,
    },
  },
  {
    id: "5",
    title: "Business Card Design",
    description: "Elegant business card layout",
    imageUrl: "/placeholder.svg?height=300&width=500",
    category: "print",
    mode: "image",
    createdAt: "2025-01-11T11:30:00Z",
    tags: ["business card", "print", "elegant", "professional"],
    prompt: "Elegant business card design, minimalist layout, premium feel, gold accents, professional typography",
    isFavorite: true,
    project: "Personal Branding",
    model: "Mode 1.0 Med",
    settings: {
      width: 1050,
      height: 600,
      steps: 35,
      seed: 567890,
    },
  },
  {
    id: "6",
    title: "E-commerce Banner",
    description: "Sale promotion banner for online store",
    imageUrl: "/placeholder.svg?height=300&width=800",
    category: "ecommerce",
    mode: "image",
    createdAt: "2025-01-10T16:45:00Z",
    tags: ["ecommerce", "sale", "banner", "promotion"],
    prompt: "E-commerce sale banner, bold typography, discount percentage prominent, urgency elements, bright colors",
    isFavorite: false,
    project: "Holiday Sale",
    model: "Mode 1.0 Low",
    settings: {
      width: 1200,
      height: 400,
      steps: 20,
      seed: 234567,
    },
  },
]

export const personalGalleryCategories = [
  { id: "all", name: "All Categories", count: mockPersonalGalleryData.length },
  {
    id: "social",
    name: "Social Media",
    count: mockPersonalGalleryData.filter((item) => item.category === "social").length,
  },
  {
    id: "marketing",
    name: "Marketing",
    count: mockPersonalGalleryData.filter((item) => item.category === "marketing").length,
  },
  {
    id: "branding",
    name: "Branding",
    count: mockPersonalGalleryData.filter((item) => item.category === "branding").length,
  },
  { id: "web", name: "Web Design", count: mockPersonalGalleryData.filter((item) => item.category === "web").length },
  {
    id: "print",
    name: "Print Design",
    count: mockPersonalGalleryData.filter((item) => item.category === "print").length,
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    count: mockPersonalGalleryData.filter((item) => item.category === "ecommerce").length,
  },
]

export const personalGalleryModes = [
  { id: "all", name: "All Types", count: mockPersonalGalleryData.length },
  { id: "image", name: "Images", count: mockPersonalGalleryData.filter((item) => item.mode === "image").length },
  { id: "video", name: "Videos", count: mockPersonalGalleryData.filter((item) => item.mode === "video").length },
  { id: "motion", name: "Motion", count: mockPersonalGalleryData.filter((item) => item.mode === "motion").length },
]

// Keep the old exports for backward compatibility if needed elsewhere
export type GalleryItem = PersonalGalleryItem
export const mockGalleryData = mockPersonalGalleryData
export const galleryCategories = personalGalleryCategories
export const galleryModes = personalGalleryModes
