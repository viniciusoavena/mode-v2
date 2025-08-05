# Arquivo: api/v1/router.py
# Agregador de rotas para a versão v1 da API.

from fastapi import APIRouter
from .endpoints import generate

api_router = APIRouter()

# Inclui a rota de geração
api_router.include_router(generate.router, prefix="/generate", tags=["Generation"])
