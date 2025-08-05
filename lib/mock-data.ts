import {
  Smartphone,
  Monitor,
  FileText,
  ShoppingBag,
  Zap,
  Palette,
  Camera,
  Building2,
  User, // People icon
  Globe, // Physical Spaces icon
  PenTool, // Tattoo icon
  Box, // Product icon
} from "lucide-react";

/**
 * Defines the main categories available in the left panel.
 * The `id` is used as a key in the `dynamicPromptSuggestions` object.
 */
export const creativeModesData = [
  {
    id: "free",
    name: "Free",
    description: "General purpose creation",
    icon: Zap,
    contexts: ["n/a"]
  },
  {
    id: "branding",
    name: "Branding",
    description: "Identidade visual e logotipos",
    icon: Palette,
    contexts: ["Logo", "Email signature", "Business Card", "Letterhead", "Brand Guide", "Icon set"]
  },
  {
    id: "web-design",
    name: "Web Design",
    description: "Interfaces e experiências digitais",
    icon: Monitor,
    contexts: ["Hero section", "Dashboard", "Mobile App", "Website", "UI Component"]
  },
  {
    id: "social-media",
    name: "Social Media",
    description: "Posts, stories e conteúdo viral",
    icon: Smartphone,
    contexts: ["Instagram post", "Story", "Carousel", "Twitter", "Thumbnail", "Linkedin background", "Cover Image"]
  },
  {
    id: "people",
    name: "People",
    description: "Avatars, portraits, and characters",
    icon: User,
    contexts: ["Avatar", "Profile Photo", "Corporate Headshot", "Character Design"]
  },
  {
    id: "physical-spaces",
    name: "Physical Spaces",
    description: "Architecture and environments",
    icon: Globe,
    contexts: ["Interior Design", "Architecture", "Landscape", "Urban", "Cityscape", "Nature", "Travel"]
  },
  {
    id: "tattoo",
    name: "Tattoo",
    description: "Designs for tattoos",
    icon: PenTool,
    contexts: ["Old-School", "Japanese", "Blackwork", "Realism", "Tribal", "Lettering"]
  },
  {
    id: "product",
    name: "Product",
    description: "Fotos de produto limpas e profissionais",
    icon: Box,
    contexts: ["Product photo", "Ad campaign", "T-shirt", "Cover", "Mug"]
  },
];

/**
 * A nested object containing specific Style and Mood suggestions for each
 * Creative Mode -> Context combination. This is the core of the dynamic UI.
 */
export const dynamicPromptSuggestions = {
  branding: {
    'Logo': {
      Style: [
        { name: "Minimalist", desc: "Simple, clean lines and shapes" },
        { name: "Geometric", desc: "Based on geometric forms" },
        { name: "Vector Art", desc: "Clean, scalable vector illustration" },
        { name: "Hand-drawn / Sketch", desc: "Artisanal and organic feel" },
        { name: "Vintage & Retro", desc: "Inspired by past design eras" },
        { name: "Corporate Clean", desc: "Professional and sharp" },
        { name: "Elegant Typography", desc: "Focus on beautiful lettering" }
      ],
      Mood: [
        { name: "Professional & Trustworthy", desc: "Reliable and serious" },
        { name: "Luxurious & Premium", desc: "Elegant and high-end" },
        { name: "Bold & Innovative", desc: "Modern and forward-thinking" },
        { name: "Friendly & Accessible", desc: "Welcoming and easy-going" },
        { name: "Modern & Techy", desc: "Futuristic and clean" },
        { name: "Solid & Established", desc: "Traditional and dependable" },
        { name: "Artisanal & Organic", desc: "Handmade and natural" }
      ]
    },
    // Contexts sharing the same suggestions as 'Logo'
    'Email signature': { Style: [], Mood: [] },
    'Business Card': { Style: [], Mood: [] },
    'Letterhead': { Style: [], Mood: [] },
    'Brand Guide': { Style: [], Mood: [] },
    'Icon set': { Style: [], Mood: [] },
  },
  'web-design': {
    'Hero section': {
      Style: [
        { name: "Minimalist", desc: "Clean with a lot of white space" },
        { name: "Glassmorphism", desc: "Frosted glass effect, modern" },
        { name: "Dark Mode", desc: "Sleek, dark-themed interface" },
        { name: "Vector Art", desc: "Illustrative and clean" },
        { name: "Brutalism", desc: "Raw, bold, and unconventional" },
        { name: "Data-Rich (Infographic)", desc: "Focus on data visualization" },
        { name: "Clean & Modern", desc: "Simple, sharp, and current" }
      ],
      Mood: [
        { name: "Professional & Clean", desc: "Corporate and tidy" },
        { name: "Intuitive & User-Friendly", desc: "Easy to navigate and use" },
        { name: "Tech & Futuristic", desc: "Advanced and innovative" },
        { name: "Light & Airy", desc: "Bright, open, and minimal" },
        { name: "Trustworthy & Secure", desc: "Safe and reliable feel" },
        { name: "Engaging & Interactive", desc: "Dynamic and captivating" },
        { name: "Serious & Focused", desc: "Formal and to-the-point" }
      ]
    },
    'Dashboard': { Style: [], Mood: [] },
    'Mobile App': { Style: [], Mood: [] },
    'Website': { Style: [], Mood: [] },
    'UI Component': { Style: [], Mood: [] },
  },
  'social-media': {
    'Instagram post': {
       Style: [
        { name: "Cinematic", desc: "Film-like, dramatic lighting" },
        { name: "Photorealistic", desc: "Looks like a real photograph" },
        { name: "3D Render", desc: "Digital 3D-generated look" },
        { name: "Vibrant Illustration", desc: "Colorful and artistic" },
        { name: "Japanese Anime", desc: "Classic anime/manga style" },
        { name: "Vintage Film", desc: "Retro, grainy film aesthetic" },
        { name: "Bold Typography", desc: "Focus on impactful text" }
      ],
      Mood: [
        { name: "Fun & Energetic", desc: "Playful and lively" },
        { name: "Inspirational & Positive", desc: "Uplifting and motivational" },
        { name: "Luxurious & Desirable", desc: "Elegant and aspirational" },
        { name: "Urban & Modern", desc: "City life and contemporary feel" },
        { name: "Dramatic", desc: "High contrast and emotional" },
        { name: "Bold & Impactful", desc: "Strong and attention-grabbing" },
        { name: "Professional & Informative", desc: "Clean and educational" }
      ]
    },
    'Story': { Style: [], Mood: [] },
    'Carousel': { Style: [], Mood: [] },
    'Twitter': { Style: [], Mood: [] },
    'Thumbnail': { Style: [], Mood: [] },
    'Linkedin background': { Style: [], Mood: [] },
    'Cover Image': { Style: [], Mood: [] },
  },
  people: {
    'Avatar': {
      Style: [
        { name: "Photorealistic (DSLR)", desc: "High-quality camera look" },
        { name: "Cinematic Portrait", desc: "Dramatic, film-style portrait" },
        { name: "Studio Headshot", desc: "Professional studio lighting" },
        { name: "Japanese Anime", desc: "Classic anime/manga style" },
        { name: "Digital Painting", desc: "Artistic, painted look" },
        { name: "Charcoal Sketch", desc: "Hand-drawn charcoal style" },
        { name: "Vintage & Retro Photo", desc: "Old-fashioned photograph" }
      ],
      Mood: [
        { name: "Confident & Powerful", desc: "Strong and self-assured" },
        { name: "Joyful & Optimistic", desc: "Happy and positive" },
        { name: "Mysterious & Moody", desc: "Enigmatic and atmospheric" },
        { name: "Serene & Calm", desc: "Peaceful and tranquil" },
        { name: "Professional", desc: "Corporate and competent" },
        { name: "Dreamy & Artistic", desc: "Ethereal and creative" },
        { name: "Dramatic & Emotional", desc: "Intense and expressive" }
      ]
    },
    'Profile Photo': { Style: [], Mood: [] },
    'Corporate Headshot': { Style: [], Mood: [] },
    'Character Design': { Style: [], Mood: [] },
  },
  'physical-spaces': {
    'Interior Design': {
      Style: [
        { name: "Photorealistic", desc: "Looks like a real photograph" },
        { name: "Architectural Sketch", desc: "Hand-drawn blueprint style" },
        { name: "3D Render (V-Ray)", desc: "High-quality 3D visualization" },
        { name: "Minimalist", desc: "Clean, simple, and uncluttered" },
        { name: "Cinematic", desc: "Film-like, moody lighting" },
        { name: "Concept Art", desc: "Imaginative and artistic" },
        { name: "Vintage Photo", desc: "Old-fashioned, nostalgic look" }
      ],
      Mood: [
        { name: "Cozy & Warm", desc: "Comfortable and inviting" },
        { name: "Modern & Sleek", desc: "Clean lines and contemporary" },
        { name: "Luxurious & Elegant", desc: "High-end and sophisticated" },
        { name: "Serene & Calm", desc: "Peaceful and relaxing" },
        { name: "Futuristic", desc: "Advanced and sci-fi" },
        { name: "Dramatic & Moody", desc: "Atmospheric and intense" },
        { name: "Urban & Gritty", desc: "City-inspired, raw, and industrial" }
      ]
    },
    'Architecture': { Style: [], Mood: [] },
    'Landscape': { Style: [], Mood: [] },
    'Urban': { Style: [], Mood: [] },
    'Cityscape': { Style: [], Mood: [] },
    'Nature': { Style: [], Mood: [] },
    'Travel': { Style: [], Mood: [] },
  },
  tattoo: {
    'Old-School': {
      Style: [
        { name: "Traditional", desc: "Bold lines, classic motifs" },
        { name: "Neo-Traditional", desc: "Traditional with more detail and color" },
        { name: "Fine Line", desc: "Delicate and precise linework" },
        { name: "Geometric", desc: "Shapes, patterns, and symmetry" },
        { name: "Watercolor", desc: "Soft, blended color splashes" },
        { name: "Sketch Style", desc: "Looks like a pencil sketch" },
        { name: "Black & Grey", desc: "Shading with black and grey ink" }
      ],
      Mood: [
        { name: "Bold & Powerful", desc: "Strong and impactful" },
        { name: "Mystical & Esoteric", desc: "Magical and symbolic" },
        { name: "Elegant & Delicate", desc: "Fine and sophisticated" },
        { name: "Dark & Edgy", desc: "Gothic and intense" },
        { name: "Spiritual", desc: "Meaningful and sacred" },
        { name: "Playful", desc: "Fun and whimsical" },
        { name: "Symbolic", desc: "Represents a deeper meaning" }
      ]
    },
    'Japanese': { Style: [], Mood: [] },
    'Blackwork': { Style: [], Mood: [] },
    'Realism': { Style: [], Mood: [] },
    'Tribal': { Style: [], Mood: [] },
    'Lettering': { Style: [], Mood: [] },
  },
  product: {
    'Product photo': {
      Style: [
        { name: "Studio Photography", desc: "Clean, professional studio setup" },
        { name: "White Background (Amazon)", desc: "Isolated product on pure white" },
        { name: "Lifestyle (in context)", desc: "Product being used in a real scene" },
        { name: "Macro / Detailed Shot", desc: "Extreme close-up on details" },
        { name: "3D Product Render", desc: "Clean, computer-generated image" },
        { name: "Minimalist", desc: "Simple composition, clean background" },
        { name: "Vector / Line Art", desc: "Illustrative and clean" }
      ],
      Mood: [
        { name: "Luxurious & Premium", desc: "High-end and sophisticated" },
        { name: "Clean & Modern", desc: "Simple, sharp, and current" },
        { name: "Durable & Rugged", desc: "Tough and long-lasting" },
        { name: "Natural & Eco-friendly", desc: "Organic and sustainable feel" },
        { name: "Tech & Futuristic", desc: "Advanced and innovative" },
        { name: "Desirable", desc: "Appealing and attractive" },
        { name: "Trustworthy", desc: "Reliable and high-quality" }
      ]
    },
    'Ad campaign': { Style: [], Mood: [] },
    'T-shirt': { Style: [], Mood: [] },
    'Cover': { Style: [], Mood: [] },
    'Mug': { Style: [], Mood: [] },
  },
};

/**
 * Fallback suggestions for the "Free" mode or any unmapped context.
 */
export const fallbackPromptSuggestions = {
  Style: [
    { name: "Photorealistic", desc: "Looks like a real photograph" },
    { name: "3D Render", desc: "Digital 3D-generated look" },
    { name: "Vector Art", desc: "Clean, scalable vector illustration" },
    { name: "Minimalist", desc: "Simple, clean lines and shapes" },
    { name: "Cinematic", desc: "Film-like, dramatic lighting" },
    { name: "Illustration", desc: "Artistic, drawn or painted style" },
    { name: "Sketch", desc: "Hand-drawn, unfinished look" }
  ],
  Mood: [
    { name: "Vibrant", desc: "Bright, lively, and energetic" },
    { name: "Playful", desc: "Fun and lighthearted" },
    { name: "Professional", desc: "Corporate and polished" },
    { name: "Dark & Moody", desc: "Atmospheric and intense" },
    { name: "Epic", desc: "Grand, dramatic, and impressive" },
    { name: "Serene", desc: "Calm, peaceful, and tranquil" },
    { name: "Futuristic", desc: "Advanced, modern, and sci-fi" }
  ]
};

// To handle contexts that share suggestions, we can post-process the data.
// This keeps the original data clean and avoids repetition.
function populateSharedSuggestions(data) {
  for (const mode in data) {
    for (const context in data[mode]) {
      const suggestions = data[mode][context];
      if (suggestions.Style.length === 0 && suggestions.Mood.length === 0) {
        // Find the first context in this mode with data and copy it
        const sourceContext = Object.keys(data[mode]).find(key => data[mode][key].Style.length > 0);
        if (sourceContext) {
          data[mode][context] = data[mode][sourceContext];
        }
      }
    }
  }
}

populateSharedSuggestions(dynamicPromptSuggestions);