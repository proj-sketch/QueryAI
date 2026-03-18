import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-2.5-flash"

# Rate Limiting
RATE_LIMIT_PER_MINUTE = 200
RATE_LIMIT_PER_DAY = 2000

# Server
BACKEND_HOST = "0.0.0.0"
BACKEND_PORT = 8000

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
