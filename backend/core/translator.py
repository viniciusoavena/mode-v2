# File: backend/core/translator.py
import os
from openai import AsyncOpenAI

# --- INÍCIO DA ATUALIZAÇÃO PARA OPENAI ---

# 1. Inicializa o cliente da OpenAI. Ele irá ler a chave de API
#    automaticamente da variável de ambiente OPENAI_API_KEY.
try:
    client = AsyncOpenAI()
    # Define o modelo a ser usado. gpt-4o-mini é a escolha mais recente e económica.
    TRANSLATION_MODEL = "gpt-4.1-nano"
except Exception as e:
    print(f"AVISO: Não foi possível inicializar o cliente OpenAI. Verifique a sua OPENAI_API_KEY. Erro: {e}")
    client = None


async def translate_prompt_intelligently(text: str) -> str:
    """
    Usa a API da OpenAI com o GPT-4.1-nano para traduzir o texto para o inglês,
    preservando nomes próprios e de marcas.
    """
    if not text or not client:
        if not client:
            print("Aviso: Cliente OpenAI não inicializado, retornando prompt original.")
        return text

    instruction = (
        "Translate the following text to English. IMPORTANT: Do not translate proper names, "
        "brand names, or words that start with a capital letter, unless they are the first "
        "word of the sentence. Return ONLY the translated text, nothing else."
    )

    try:
        # 2. Cria a chamada para a API de Chat Completions
        response = await client.chat.completions.create(
            model=TRANSLATION_MODEL,
            messages=[
                {"role": "system", "content": instruction},
                {"role": "user", "content": text},
            ],
            temperature=0, # Para tradução, queremos a resposta mais direta possível
            max_tokens=200, # Limite generoso para a tradução
        )
        
        # 3. Extrai o texto da resposta
        translated_text = response.choices[0].message.content.strip()
        
        return translated_text if translated_text else text

    except Exception as e:
        print(f"Erro na API da OpenAI: {e}. Usando o prompt original.")
        return text

# --- FIM DA ATUALIZAÇÃO PARA OPENAI ---