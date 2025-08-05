# File: backend/core/image_generator.py
import fal_client
from typing import Dict, Any

# O seu mapeamento de modelos (MODEL_MAP) permanece aqui...
MODEL_MAP = {
    "free": {
        "low": "fal-ai/imagen4/preview",
        "med": "fal-ai/bytedance/seedream/v3/text-to-image",
        "high": "fal-ai/gpt-4o"
    },
    "branding": {
        "low": "fal-ai/recraft/v3/text-to-image",
        "med": "fal-ai/ideogram/v3",
        "high": "fal-ai/gpt-4o"
    },
    "web-design": {
        "low": "fal-ai/ideogram/v3",
        "med": "fal-ai/imagen4/preview/ultra",
        "high": "fal-ai/gpt-4o"
    },
    "social-media": {
        "low": "fal-ai/hidream-i1-dev",
        "med": "fal-ai//imagen4/preview/ultra",
        "high": "fal-ai/gpt-4o"
    },
    "people": {
        "low": "fal-ai/imagen-4",
        "med": "fal-ai/bytedance/seedream/v3/text-to-image",
        "high": "fal-ai/flux-pro"
    },
    "physical-spaces": {
        "low": "fal-ai/imagen4/preview/ultra",
        "med": "fal-ai/recraft/v3/text-to-image",
        "high": "fal-ai/bytedance/seedream/v3/text-to-image"
    },
    "product": {
        "low": "fal-ai/bytedance/seedream/v3/text-to-image",
        "med": "fal-ai/ideogram/v3",
        "high": "fal-ai/gpt-4o"
    }
}

def convert_json_to_string_prompt(prompt_data: Dict[str, Any]) -> str:
    """
    Converte o objeto JSON estruturado num único prompt de texto detalhado.
    """
    description = prompt_data.get("description", "")
    style_name = prompt_data.get("style_name", "") # Agora contém os estilos corretos

    # Junta a descrição e o estilo de forma inteligente.
    final_prompt = ", ".join(filter(None, [description, style_name]))
    
    quality_tags = prompt_data.get("quality_tags", [])
    if quality_tags:
        final_prompt += ", " + ", ".join(quality_tags)
        
    return final_prompt

async def generate_image_from_json(prompt_data: Dict[str, Any], creative_mode: str, quality: str) -> Dict[str, Any]:
    """
    Seleciona o modelo de IA correto com base no modo/qualidade, converte o JSON
    para um prompt de texto e chama a API da Fal.ai.
    """
    mode_key = creative_mode.lower().replace(' ', '-')
    quality_key = quality.lower()
    
    model_id = MODEL_MAP.get(mode_key, {}).get(quality_key)

    if not model_id:
        print(f"Aviso: Nenhuma correspondência de modelo para '{mode_key}' com qualidade '{quality_key}'. Usando o fallback do modo 'Free'.")
        model_id = MODEL_MAP["free"].get(quality_key)
        if not model_id:
            model_id = MODEL_MAP["free"]["med"]
            print(f"Aviso: Qualidade '{quality_key}' inválida. Usando o fallback 'med' do modo 'Free'.")
            
    print(f"Modo: '{mode_key}', Qualidade: '{quality_key}'. Modelo selecionado: '{model_id}'")

    final_text_prompt = convert_json_to_string_prompt(prompt_data)
    print(f"Prompt de texto final enviado: {final_text_prompt}")

    try:
        result = await fal_client.run_async(
            model_id,
            arguments={"prompt": final_text_prompt}
        )
        
        if not result or "images" not in result or not result["images"]:
            raise ValueError("A resposta da API da Fal.ai não contém imagens.")
            
        return result
        
    except Exception as e:
        print(f"Erro ao chamar a API da Fal.ai com o modelo '{model_id}': {e}")
        raise