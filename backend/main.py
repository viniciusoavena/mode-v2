# Arquivo: main.py
# Ponto de entrada principal da aplicação FastAPI.

# --- INÍCIO DA CORREÇÃO ---
# Adicionamos estas duas linhas para carregar explicitamente as variáveis de ambiente
# do arquivo .env no início de tudo.
from dotenv import load_dotenv
load_dotenv()
# --- FIM DA CORREÇÃO ---

from fastapi import FastAPI
from api.v1.router import api_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Mode V1 Backend",
    description="Backend para geração de imagens com IA.",
    version="1.0.0"
)

# Configuração do CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # A origem do seu frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health Check"])
def read_root():
    """Verifica se o servidor está a funcionar."""
    return {"status": "ok"}

# Inclui as rotas da API da v1
app.include_router(api_router, prefix="/api/v1")