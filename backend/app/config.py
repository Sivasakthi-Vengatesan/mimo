import os

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "qwen3.5:2b")
OLLAMA_TIMEOUT = float(os.getenv("OLLAMA_TIMEOUT", "90.0"))
MAX_HISTORY_MESSAGES = int(os.getenv("MAX_HISTORY_MESSAGES", "10"))
ENABLE_CLOUD_FALLBACK = os.getenv("ENABLE_CLOUD_FALLBACK", "true").lower() in ("true", "1", "yes")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")
