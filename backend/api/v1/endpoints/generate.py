# File: backend/api/v1/endpoints/generate.py
import json
from fastapi import APIRouter, HTTPException, Body
from models.generate import GenerateRequest, GenerateResponse
from core.prompt_composer import load_preset, apply_modifiers_and_influence
from core.translator import translate_prompt_intelligently
from core.image_generator import generate_image_from_json
from openai import AsyncOpenAI

router = APIRouter()

# Inicializa o cliente da OpenAI.
# Ele irá ler a chave de API da variável de ambiente OPENAI_API_KEY.
try:
    client = AsyncOpenAI()
except Exception as e:
    print(f"AVISO: Não foi possível inicializar o cliente OpenAI. A moderação de segurança estará desativada. Erro: {e}")
    client = None

@router.post("/", response_model=GenerateResponse)
async def handle_structured_generation(request: GenerateRequest = Body(...)):
    """
    Orquestra todo o processo de geração de imagem, desde a validação de segurança
    até à chamada final do modelo de IA.
    """
    try:
        # Camada 1: Moderação Proativa do Prompt do Utilizador
        if client:
            try:
                mod_response = await client.moderations.create(input=request.user_prompt)
                if mod_response.results[0].flagged:
                    print(f"Prompt do utilizador bloqueado pela moderação: '{request.user_prompt}'")
                    raise HTTPException(status_code=400, detail="O seu prompt viola as nossas políticas de conteúdo e segurança.")
            except Exception as e:
                # Se a API de moderação falhar, regista o erro mas continua o processo
                # dependendo das outras camadas de segurança.
                print(f"Erro na API de moderação da OpenAI: {e}. A prosseguir com as outras camadas de segurança.")

        # Camada 2: Carregar o Template Base Granular
        preset_json = load_preset(request.creative_mode, request.context)

        # Camada 3: Aplicar Modificadores da UI e Injetar "Influência Secreta"
        final_json = apply_modifiers_and_influence(
            preset_json,
            request.modifiers,
            request.creative_mode,
            request.context
        )
        
        # Traduzir o prompt do utilizador de forma inteligente
        translated_prompt = await translate_prompt_intelligently(request.user_prompt)
        
        # Inserir o prompt traduzido no campo 'description' do JSON
        final_json["description"] = translated_prompt

        # Camada 4: Gerar a imagem usando o prompt composto e o negative_prompt
        generation_result = await generate_image_from_json(
            prompt_data=final_json,
            creative_mode=request.creative_mode,
            quality=request.quality
        )
        
        # Retornar a resposta bem-sucedida para o frontend
        return GenerateResponse(
            image_url=generation_result["images"][0]["url"],
            prompt_used=json.dumps(final_json, indent=2), # Retorna o JSON exato usado para depuração
            seed=generation_result.get("seed")
        )

    except FileNotFoundError as e:
        # Erro se um ficheiro de preset não for encontrado
        raise HTTPException(status_code=404, detail=f"Erro de configuração do servidor: {e}")
    except HTTPException as e:
        # Re-lança exceções HTTP para que o FastAPI as trate corretamente
        raise e
    except Exception as e:
        # Captura qualquer outro erro inesperado durante o processo
        print(f"Ocorreu um erro inesperado durante a geração: {e}")
        raise HTTPException(status_code=500, detail="Não foi possível gerar a imagem. Tente novamente mais tarde.")