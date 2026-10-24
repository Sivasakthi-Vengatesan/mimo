import os
import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .schemas import (
    HealthResponse,
    ChatRequest,
    ChatResponse,
    TaskBreakdownRequest,
    TaskBreakdownResponse
)
from .ollama_service import get_health, chat_with_ollama, breakdown_goal_with_ollama

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("mimo.api")

app = FastAPI(
    title="MIMO Local AI Companion Backend",
    description="Local-first FastAPI backend connecting MIMO frontend to local Ollama inference",
    version="1.0.0"
)

# CORS middleware for local frontend dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    logger.info("Initializing MIMO Local AI Backend...")
    health = await get_health()
    if health.ollama_connected:
        logger.info(f"Ollama connected. Active model: {health.configured_model}. Available: {health.available_models}")
    else:
        logger.warning(f"Ollama not currently reachable: {health.error}")

@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """Report backend status, Ollama connectivity, and available local models."""
    return await get_health()

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Chat endpoint applying bot-specific instructions and invoking local Ollama inference."""
    try:
        result = await chat_with_ollama(
            message=request.message,
            bot_id=request.bot_id,
            custom_prompt=request.custom_prompt,
            conversation_history=request.conversation_history
        )
        return ChatResponse(
            reply=result["reply"],
            bot_id=result["bot_id"],
            model=result["model"]
        )
    except ConnectionError as ce:
        logger.error(f"Ollama connection error: {ce}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(ce)
        )
    except TimeoutError as te:
        logger.error(f"Inference timeout: {te}")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(te)
        )
    except Exception as e:
        logger.error(f"Unexpected chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate AI response. Please ensure your local model is ready."
        )

@app.post("/api/tasks/breakdown", response_model=TaskBreakdownResponse)
async def breakdown_endpoint(request: TaskBreakdownRequest):
    """Break down a high-level goal into structured actionable steps using local AI."""
    try:
        steps = await breakdown_goal_with_ollama(request.goal)
        health = await get_health()
        return TaskBreakdownResponse(
            goal=request.goal,
            steps=steps,
            model=health.configured_model
        )
    except ConnectionError as ce:
        logger.error(f"Task breakdown connection error: {ce}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(ce)
        )
    except TimeoutError as te:
        logger.error(f"Task breakdown timeout: {te}")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=str(te)
        )
    except Exception as e:
        logger.error(f"Task breakdown error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to break down task. Please check local model status."
        )

# Frontend Static / SPA Serving
FRONTEND_DIST = os.path.abspath(
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
)

if os.path.exists(FRONTEND_DIST) and os.path.exists(os.path.join(FRONTEND_DIST, "index.html")):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path in ("docs", "openapi.json", "redoc"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
else:
    @app.api_route("/", methods=["GET", "HEAD"])
    async def root():
        return {
            "name": "MIMO AI Backend",
            "status": "online",
            "docs": "/docs"
        }

