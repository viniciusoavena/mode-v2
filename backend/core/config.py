# Arquivo: core/config.py
# Carrega as configurações e segredos do ambiente.

import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
VECTORIZER_API_KEY = os.getenv("VECTORIZER_API_KEY")
FAL_KEY = os.getenv("FAL_KEY")
