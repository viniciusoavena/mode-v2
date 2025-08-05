# File: backend/core/prompt_composer.py
import json
import os
from typing import Dict, Any

PRESETS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'presets')

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

def apply_modifiers(preset_data: Dict[str, Any], modifiers: Dict[str, Any]) -> Dict[str, Any]:
    """
    Aplica dinamicamente os modificadores, construindo uma nova lista de estilos.
    """
    if not modifiers:
        return preset_data

    # --- INÍCIO DA CORREÇÃO ---
    # Cria uma nova lista para os estilos, em vez de modificar a existente.
    style_parts = []

    # Adiciona o Style do modifier, se existir
    if "style" in modifiers:
        style_parts.append(modifiers["style"])

    # Adiciona o Mood do modifier, se existir
    if "mood" in modifiers:
        style_parts.append(modifiers["mood"])
        
    # Adiciona as Cores do modifier, se existir
    if "colors" in modifiers:
        style_parts.append(modifiers["colors"] + " color palette")

    # Se a lista de estilos não estiver vazia, ela substitui o style_name do preset.
    # Caso contrário, o style_name original do preset é mantido.
    if style_parts:
        preset_data["style_name"] = ", ".join(filter(None, style_parts))
    # --- FIM DA CORREÇÃO ---
    
    return preset_data