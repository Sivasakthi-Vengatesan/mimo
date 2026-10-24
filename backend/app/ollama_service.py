import json
import re
import logging
from typing import List, Dict, Any, Optional
import httpx
from .config import OLLAMA_BASE_URL, DEFAULT_MODEL, OLLAMA_TIMEOUT, MAX_HISTORY_MESSAGES
from .prompts import MIMO_DEFAULT_PROMPT, BUILTIN_BOT_PROMPTS, TASK_BREAKDOWN_SYSTEM_PROMPT
from .schemas import HealthResponse, ChatMessage, TaskBreakdownStep

logger = logging.getLogger("mimo.ollama")

def clean_output(text: str) -> str:
    """Clean model output, removing reasoning tags if any remain."""
    if not text:
        return ""
    cleaned = re.sub(r"<think>[\s\S]*?</think>", "", text, flags=re.DOTALL)
    cleaned = re.sub(r"^<think>[\s\S]*", "", cleaned)
    return cleaned.strip()

async def get_health() -> HealthResponse:
    """Check Ollama connectivity, available tags, and model status."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            res = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if res.status_code == 200:
                data = res.json()
                models = [m.get("name", "") for m in data.get("models", [])]
                is_available = any(DEFAULT_MODEL in m for m in models)
                active_model = DEFAULT_MODEL if is_available else (models[0] if models else DEFAULT_MODEL)
                return HealthResponse(
                    status="healthy",
                    ollama_connected=True,
                    configured_model=active_model,
                    model_available=bool(models),
                    available_models=models,
                    error=None
                )
            else:
                return HealthResponse(
                    status="degraded",
                    ollama_connected=True,
                    configured_model=DEFAULT_MODEL,
                    model_available=False,
                    available_models=[],
                    error=f"Ollama returned status {res.status_code}"
                )
    except httpx.ConnectError:
        return HealthResponse(
            status="offline",
            ollama_connected=False,
            configured_model=DEFAULT_MODEL,
            model_available=False,
            available_models=[],
            error="Ollama service is not reachable at " + OLLAMA_BASE_URL
        )
    except Exception as e:
        return HealthResponse(
            status="error",
            ollama_connected=False,
            configured_model=DEFAULT_MODEL,
            model_available=False,
            available_models=[],
            error=str(e)
        )

async def resolve_active_model() -> str:
    health = await get_health()
    if health.available_models:
        for m in health.available_models:
            if DEFAULT_MODEL in m:
                return m
        return health.available_models[0]
    return DEFAULT_MODEL

async def chat_with_ollama(
    message: str,
    bot_id: str = "mimo",
    custom_prompt: Optional[str] = None,
    conversation_history: Optional[List[ChatMessage]] = None
) -> Dict[str, str]:
    """Execute a conversational chat request against the local Ollama instance with think=False for ultra-fast responses."""
    if custom_prompt and custom_prompt.strip():
        system_prompt = custom_prompt.strip()
    else:
        system_prompt = BUILTIN_BOT_PROMPTS.get(bot_id, MIMO_DEFAULT_PROMPT)

    messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]
    
    if conversation_history:
        recent = conversation_history[-MAX_HISTORY_MESSAGES:]
        for msg in recent:
            if msg.content and msg.content.strip():
                messages.append({"role": msg.role, "content": msg.content.strip()})

    messages.append({"role": "user", "content": message.strip()})
    model_tag = await resolve_active_model()

    payload = {
        "model": model_tag,
        "messages": messages,
        "stream": False,
        "think": False,  # Bypasses 1500-token thinking delays for instant ~1s conversational replies
        "options": {
            "temperature": 0.7,
            "num_predict": 512,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            res = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            if res.status_code != 200:
                raise RuntimeError(f"Ollama chat error (HTTP {res.status_code}): {res.text}")
            
            data = res.json()
            raw_reply = data.get("message", {}).get("content", "")
            cleaned_reply = clean_output(raw_reply)
            
            if not cleaned_reply:
                cleaned_reply = "I'm right here with you in the cosmos! What would you like to explore or accomplish next?"

            return {
                "reply": cleaned_reply,
                "bot_id": bot_id,
                "model": model_tag
            }
    except httpx.ConnectError:
        raise ConnectionError("Ollama is not running. Please start Ollama on your machine.")
    except httpx.TimeoutException:
        raise TimeoutError("Model inference timed out. Please try again.")

async def breakdown_goal_with_ollama(goal: str) -> List[TaskBreakdownStep]:
    """Ask Ollama to break down a user's goal into structured actionable steps with think=False for sub-second responses."""
    model_tag = await resolve_active_model()
    
    messages = [
        {"role": "system", "content": TASK_BREAKDOWN_SYSTEM_PROMPT},
        {"role": "user", "content": f"Break down this goal into actionable steps: {goal}"}
    ]

    payload = {
        "model": model_tag,
        "messages": messages,
        "stream": False,
        "think": False,
        "options": {
            "temperature": 0.3,
            "num_predict": 400,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            res = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            if res.status_code != 200:
                raise RuntimeError(f"Ollama task breakdown failed with status {res.status_code}")

            data = res.json()
            raw_text = data.get("message", {}).get("content", "")
            cleaned = clean_output(raw_text)

            steps_data = None
            try:
                steps_data = json.loads(cleaned)
            except json.JSONDecodeError:
                match = re.search(r"\[[\s\S]*\]", cleaned)
                if match:
                    try:
                        steps_data = json.loads(match.group(0))
                    except json.JSONDecodeError:
                        pass

            steps: List[TaskBreakdownStep] = []
            if isinstance(steps_data, list) and len(steps_data) > 0:
                for item in steps_data:
                    if isinstance(item, dict) and "title" in item:
                        p = item.get("priority", "medium").lower()
                        if p not in ("high", "medium", "low"):
                            p = "medium"
                        steps.append(TaskBreakdownStep(
                            title=str(item["title"])[:100],
                            description=str(item.get("description", ""))[:300],
                            priority=p
                        ))

            if not steps:
                lines = [line.strip() for line in cleaned.split("\n") if line.strip()]
                for line in lines[:5]:
                    clean_line = re.sub(r"^[\d\.\-\*\#\s]+", "", line).strip()
                    if clean_line and len(clean_line) > 3:
                        steps.append(TaskBreakdownStep(
                            title=clean_line[:100],
                            description=f"Action step for {goal}",
                            priority="medium"
                        ))

            if not steps:
                # Fallback standard decomposition if model generated no recognizable steps
                steps = [
                    TaskBreakdownStep(title=f"Define scope and milestones for {goal}", description="Clarify the primary deliverables and timeline.", priority="high"),
                    TaskBreakdownStep(title="Gather core materials and resources", description="Collect references, tools, and documentation.", priority="medium"),
                    TaskBreakdownStep(title="Execute first primary work block", description="Focus on the most challenging core component first.", priority="high"),
                    TaskBreakdownStep(title="Review, test, and iterate", description="Validate results and refine details.", priority="medium")
                ]

            return steps

    except httpx.ConnectError:
        raise ConnectionError("Ollama is not running. Start Ollama to use AI task breakdown.")
    except httpx.TimeoutException:
        raise TimeoutError("Task breakdown request timed out.")
