# File: backend/core/prompt_composer.py
import json
import os
import random
from typing import Dict, Any

PRESETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'presets')

# Dicionário de "Ingredientes Secretos" para rotação de estilo
STYLE_INFLUENCERS = {
    "branding": {
        "Logo": [
            "inspired by the strategic design of Collins",
            "minimalism in the style of Pentagram",
            "bold identity reminiscent of Wolff Olins",
            "modern startup branding like Red Antler"
        ]
    },
    "web-design": {
        "Hero section": [
            "UI design inspired by Metalab",
            "interface with the clean aesthetic of Instrument",
            "digital experience in the style of Fantasy Interactive"
        ]
    }
}

def load_preset(creative_mode: str, context: str) -> Dict[str, Any]:
    """Carrega o arquivo JSON do preset com base no modo e contexto."""
    context_filename_part = context.lower().replace(' ', '_')
    filename = f"{creative_mode.lower()}_{context_filename_part}.json"
    
    filepath = os.path.join(PRESETS_DIR, filename)

    if not os.path.exists(filepath):
        default_path = os.path.join(PRESETS_DIR, 'default.json')
        if not os.path.exists(default_path):
            raise FileNotFoundError(f"Preset '{filename}' não encontrado e nenhum 'default.json' de fallback foi achado.")
        filepath = default_path
        print(f"Aviso: Preset '{filename}' não encontrado. Usando 'default.json'.")

    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def apply_modifiers_and_influence(preset_data: Dict[str, Any], modifiers: Dict[str, Any], creative_mode: str, context: str) -> Dict[str, Any]:
    """
    Aplica os modificadores da UI e injeta aleatoriamente uma influência de estilo secreta.
    """
    # 1. Aplicar os modificadores do utilizador, se existirem
    if modifiers:
        style_parts = []
        if "style" in modifiers: style_parts.append(modifiers["style"])
        if "mood" in modifiers: style_parts.append(modifiers["mood"])
        if "colors" in modifiers: style_parts.append(f"{modifiers['colors']} color palette")

        if style_parts:
            preset_data["style_name"] = ", ".join(filter(None, style_parts))

    # 2. Injetar a influência secreta
    influencer_list = STYLE_INFLUENCERS.get(creative_mode.lower(), {}).get(context, [])
    if influencer_list:
        chosen_influence = random.choice(influencer_list)
        # Adiciona a influência ao final do style_name
        if preset_data.get("style_name"):
            preset_data["style_name"] += f", {chosen_influence}"
        else:
            preset_data["style_name"] = chosen_influence
            
    return preset_data