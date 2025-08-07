# File: backend/core/image_generator.py
import fal_client
import json
import httpx
import base64
from typing import Dict, Any, Optional
from openai import AsyncOpenAI

# Inicializa o cliente da OpenAI.
try:
    openai_client = AsyncOpenAI()
except Exception as e:
    print(f"AVISO: Não foi possível inicializar o cliente OpenAI. A geração com DALL-E 3 estará desativada. Erro: {e}")
    openai_client = None

# MODEL_MAP FINAL com os ajustes finais.
MODEL_MAP = {
    "free": {
        "low": {"id": "fal-ai/imagen4/preview", "params": {}},
        "med": {"id": "fal-ai/bytedance/seedream/v3/text-to-image", "params": {}},
        "high": {"id": "openai/gpt-image-1", "params": {"quality": "high"}}
    },
    "branding": {
        "low": {"id": "fal-ai/recraft/v3/text-to-image", "params": {"style": "digital_illustration"}},
        "med": {"id": "fal-ai/ideogram/v3", "params": {"style": "DESIGN", "rendering_speed": "QUALITY", "expand_prompt": True}},
        "high": {"id": "openai/gpt-image-1", "params": {"quality": "high", "background":"transparent"}}
    },
    "web-design": {
        "low": {"id": "fal-ai/ideogram/v3", "params": {"style": "DESIGN"}},
        "med": {"id": "fal-ai/imagen4/preview/ultra", "params": {}},
        "high": {"id": "openai/gpt-image-1", "params": {"quality": "high"}}
    },
    "social-media": {
        "low": {"id": "fal-ai/hidream-i1-dev", "params": {}},
        "med": {"id": "fal-ai//imagen4/preview/ultra", "params": {}},
        "high": {"id": "openai/gpt-image-1", "params": {"quality": "high"}}
    },
    "people": {
        "low": {"id": "fal-ai/flux-pro/kontext/max/text-to-image", "params": {}},
        "med": {"id": "fal-ai/imagen-4/preview/ultra", "params": {}},
        "high": {"id": "fal-ai/bytedance/seedream/v3/text-to-image", "params": {"guidance_scale": 7.5}}
    },
    "physical-spaces": {
        "low": {"id": "fal-ai/imagen4/preview/ultra", "params": {}},
        "med": {"id": "fal-ai/recraft/v3/text-to-image", "params": {"style": "realistic_image"}},
        "high": {"id": "fal-ai/bytedance/seedream/v3/text-to-image", "params": {}}
    },
    "product": {
        "low": {"id": "fal-ai/bytedance/seedream/v3/text-to-image", "params": {"guidance_scale": 7.5}},
        "med": {"id": "fal-ai/ideogram/v3", "params": {"style": "PRODUCT", "rendering_speed": "QUALITY"}},
        "high": {"id": "openai/gpt-image-1", "params": {"quality": "high"}}
    }
}

def build_prompt_from_dict(data: Any) -> str:
    if isinstance(data, dict): return ", ".join(build_prompt_from_dict(v) for v in data.values())
    if isinstance(data, list): return ", ".join(str(item) for item in data)
    return str(data)

def convert_json_to_string_prompt(prompt_data: Dict[str, Any]) -> str:
    parts = []
    if "persona" in prompt_data: parts.append(prompt_data["persona"])
    if "description" in prompt_data and prompt_data["description"]: parts.append(f"({prompt_data['description']}:1.2)")
    for key, value in prompt_data.items():
        if key not in ["persona", "description", "negative_prompt", "subject_details"]:
            parts.append(build_prompt_from_dict(value))
    return ", ".join(filter(None, parts))

async def generate_image_from_json(prompt_data: Dict[str, Any], creative_mode: str, quality: str, image_size: Optional[Dict[str, int]] = None) -> Dict[str, Any]:
    mode_key = creative_mode.lower().replace(' ', '-')
    quality_key = quality.lower()
    
    # Lógica de fallback atualizada para usar o modo "free"
    model_config = MODEL_MAP.get(mode_key, {}).get(quality_key)
    if not model_config:
        print(f"Aviso: Combinação de modo/qualidade não encontrada. Usando o fallback para 'free'.")
        model_config = MODEL_MAP["free"].get(quality_key)
    
    model_id = model_config["id"]
    model_params = model_config.get("params", {}).copy()
    final_text_prompt = convert_json_to_string_prompt(prompt_data)
    negative_prompt = prompt_data.get("negative_prompt", "")

    print(f"Roteando para o modelo: '{model_id}'")

    # Funde os parâmetros da UI com os defaults do modelo
    if image_size:
        if model_id.startswith("openai/"):
            model_params["size"] = f"{image_size['width']}x{image_size['height']}"
        else:
            model_params["image_size"] = image_size

    if model_id.startswith("openai/"):
        if not openai_client: raise ConnectionError("Cliente OpenAI não inicializado.")
        
        # Usa "gpt-image-1" se for o ID, senão usa o nome correto (dall-e-3)
        model_name = model_id.split('/')[1] if model_id.split('/')[1] == "gpt-image-1" else "dall-e-3"
        
        arguments = {"model": model_name, "prompt": final_text_prompt, "n": 1, "response_format": "b64_json", **model_params}
        
        print(f"Argumentos Finais para OpenAI: {arguments}")
        result = await openai_client.images.generate(**arguments)
        
        image_b64 = result.data[0].b64_json
        return {"images": [{"url": f"data:image/png;base64,{image_b64}"}], "seed": None}

    elif model_id.startswith("fal-ai/"):
        arguments = model_params
        arguments["prompt"] = final_text_prompt
        if negative_prompt: arguments["negative_prompt"] = negative_prompt
        
        print(f"Argumentos Finais para Fal.ai: {json.dumps(arguments, indent=2)}")
        result = await fal_client.run_async(model_id, arguments=arguments)
        
        image_url = result["images"][0]["url"]
        async with httpx.AsyncClient() as client:
            response = await client.get(image_url)
            response.raise_for_status()
            image_b64 = base64.b64encode(response.content).decode("utf-8")
        
        result["images"][0]["url"] = f"data:image/png;base64,{image_b64}"
        return result

    else:
        raise ValueError(f"Prefixo de modelo desconhecido: '{model_id}'.")