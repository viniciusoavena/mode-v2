# File: backend/api/v1/endpoints/generate.py
import json
from fastapi import APIRouter, HTTPException, Body
from models.generate import GenerateRequest, GenerateResponse
from core.prompt_composer import load_preset, apply_modifiers
from core.translator import translate_prompt_intelligently
from core.image_generator import generate_image_from_json

router = APIRouter()

@router.post("/", response_model=GenerateResponse)
async def handle_structured_generation(request: GenerateRequest = Body(...)):
    """
    Orquestra o processo de geração de imagem a partir da requisição estruturada do frontend.
    """
    try:
        final_json = load_preset(request.creative_mode, request.context)
        final_json = apply_modifiers(final_json, request.modifiers)
        
        translated_prompt = await translate_prompt_intelligently(request.user_prompt)
        final_json["description"] = translated_prompt

        # CORREÇÃO: Passa os argumentos 'creative_mode' e 'quality' que estavam em falta.
        generation_result = await generate_image_from_json(
            prompt_data=final_json,
            creative_mode=request.creative_mode,
            quality=request.quality
        )
        
        return GenerateResponse(
            image_url=generation_result["images"][0]["url"],
            prompt_used=json.dumps(final_json, indent=2),
            seed=generation_result.get("seed")
        )

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Erro de configuração: {e}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado durante a geração: {e}")
        raise HTTPException(status_code=500, detail="Não foi possível gerar a imagem. Tente novamente mais tarde.")