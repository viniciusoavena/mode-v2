# File: backend/models/generate.py
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class ImageSize(BaseModel):
    width: int
    height: int

class GenerateRequest(BaseModel):
    creative_mode: str = Field(..., description="O modo criativo selecionado, ex: 'Product'")
    context: str = Field(..., description="O contexto dentro do modo, ex: 'Studio Photography'")
    user_prompt: str = Field(..., description="O prompt de texto fornecido pelo usuário.")
    modifiers: Dict[str, Any] = Field({}, description="Opções do AI Assistant, como Style, Mood, etc.")
    quality: str = Field(..., description="O nível de qualidade selecionado, ex: 'low', 'med', 'high'")
    image_size: Optional[ImageSize] = Field(None, description="Dimensões da imagem (largura e altura) vindas da UI.")
    output_format: str = Field("png", description="Formato da imagem de saída.")

class GenerateResponse(BaseModel):
    image_data: str = Field(..., description="Os dados da imagem gerada em formato base64 (data:image/png;base64,...).")
    prompt_used: str = Field(..., description="O prompt final (em formato JSON) que foi usado para a geração.")
    seed: Optional[int] = Field(None, description="A seed usada para a geração.")