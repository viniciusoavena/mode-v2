# File: backend/models/generate.py
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class GenerateRequest(BaseModel):
    creative_mode: str = Field(..., description="O modo criativo selecionado, ex: 'Product'")
    context: str = Field(..., description="O contexto dentro do modo, ex: 'Studio Photography'")
    user_prompt: str = Field(..., description="O prompt de texto fornecido pelo usuário.")
    modifiers: Dict[str, Any] = Field({}, description="Opções do AI Assistant, como Style, Mood, etc.")
    quality: str = Field(..., description="O nível de qualidade selecionado, ex: 'low', 'med', 'high'")

class GenerateResponse(BaseModel):
    image_url: str = Field(..., description="A URL da imagem gerada.")
    prompt_used: str = Field(..., description="O prompt final (em formato JSON) que foi usado para a geração.")
    seed: Optional[int] = Field(None, description="A seed usada para a geração.")