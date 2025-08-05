# Arquivo: core/prompt_builder.py
# Lógica para construir o prompt final com base no modo e contexto.

PROMPT_TEMPLATES = {
    "social": {
        "Instagram Post": "A vibrant, eye-catching Instagram post about {user_prompt}. Style: modern, high-contrast, engaging, professional photography, 8k.",
        "Story": "A full-screen 9:16 aspect ratio image for an Instagram Story about {user_prompt}. Style: dynamic, bold text overlay area, trending on artstation.",
        "LinkedIn": "A professional and clean image for a LinkedIn post about {user_prompt}. Corporate branding, muted color palette, sharp focus.",
        "Twitter": "A concise and impactful image for a Twitter post related to {user_prompt}. Horizontal aspect ratio, bold visuals.",
        "TikTok": "A fun, vibrant, and trendy vertical video thumbnail about {user_prompt}. Gen-Z aesthetic, bright colors, dynamic."
    },
    "marketing": {
        "Banner Ad": "A professional banner advertisement for a website, focusing on {user_prompt}. Clean design, clear call-to-action space, high-resolution product shot.",
        "Email Header": "An engaging email header image for a campaign about {user_prompt}.",
        "Landing Page": "A hero image for a landing page about {user_prompt}. Inspiring and high-quality.",
        "Flyer": "A print-ready flyer design about {user_prompt}.",
        "Brochure": "A professional brochure cover image about {user_prompt}."
    },
    # Adicione os outros modos e contextos aqui...
}

def build_final_prompt(mode: str, context: str, user_prompt: str) -> str:
    """Constrói um prompt detalhado a partir das seleções do usuário."""
    template = PROMPT_TEMPLATES.get(mode, {}).get(context)
    
    if not template:
        # Fallback para um prompt genérico se o modo/contexto não for encontrado
        return f"A high-quality, professional image about: {user_prompt}, 4k, detailed"
    
    return template.format(user_prompt=user_prompt)
