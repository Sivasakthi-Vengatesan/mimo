import json
import re
import logging
from typing import List, Dict, Any, Optional
import httpx
from .config import (
    OLLAMA_BASE_URL,
    DEFAULT_MODEL,
    OLLAMA_TIMEOUT,
    MAX_HISTORY_MESSAGES,
    ENABLE_CLOUD_FALLBACK,
    GROQ_API_KEY,
    OPENAI_API_KEY,
    OPENAI_BASE_URL
)
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
    """Check Ollama connectivity, cloud API availability, or fallback status."""
    # 1. Try local or custom OLLAMA_BASE_URL
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
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
    except Exception:
        pass

    # 2. Check for Cloud LLM keys (Groq or OpenAI)
    if GROQ_API_KEY:
        return HealthResponse(
            status="healthy",
            ollama_connected=True,
            configured_model="groq/llama-3.3-70b",
            model_available=True,
            available_models=["groq/llama-3.3-70b"],
            error=None
        )
    if OPENAI_API_KEY:
        return HealthResponse(
            status="healthy",
            ollama_connected=True,
            configured_model="openai/gpt-4o-mini",
            model_available=True,
            available_models=["openai/gpt-4o-mini"],
            error=None
        )

    # 3. Fallback preview mode
    if ENABLE_CLOUD_FALLBACK:
        return HealthResponse(
            status="healthy",
            ollama_connected=True,
            configured_model="qwen3.5:2b (cloud preview)",
            model_available=True,
            available_models=["qwen3.5:2b (cloud preview)"],
            error="Cloud demo mode: Connect local Ollama with a tunnel or run MIMO locally for 100% on-device AI."
        )

    return HealthResponse(
        status="offline",
        ollama_connected=False,
        configured_model=DEFAULT_MODEL,
        model_available=False,
        available_models=[],
        error="Ollama service is not reachable at " + OLLAMA_BASE_URL
    )

async def resolve_active_model() -> str:
    health = await get_health()
    if health.available_models:
        for m in health.available_models:
            if DEFAULT_MODEL in m:
                return m
        return health.available_models[0]
    return DEFAULT_MODEL

async def call_cloud_llm(messages: List[Dict[str, str]]) -> Optional[str]:
    """Call Groq or OpenAI API if configured."""
    try:
        if GROQ_API_KEY:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 512
                    }
                )
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
        elif OPENAI_API_KEY:
            async with httpx.AsyncClient(timeout=30.0) as client:
                res = await client.post(
                    f"{OPENAI_BASE_URL}/chat/completions",
                    headers={"Authorization": f"Bearer {OPENAI_API_KEY}"},
                    json={
                        "model": "gpt-4o-mini",
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 512
                    }
                )
                if res.status_code == 200:
                    return res.json()["choices"][0]["message"]["content"]
    except Exception as e:
        logger.warning(f"Cloud LLM request failed: {e}")
    return None

def generate_fallback_chat_reply(message: str, bot_id: str) -> str:
    """Generate an interactive persona-aware companion reply when Ollama is not directly reachable from cloud container."""
    msg_lower = message.lower().strip()
    
    if bot_id == "study-buddy":
        persona_prefix = "📚 **Study Buddy**: "
    elif bot_id == "daily-planner":
        persona_prefix = "🗓️ **Daily Planner**: "
    elif bot_id == "coding-pal":
        persona_prefix = "💻 **Coding Pal**: "
    else:
        persona_prefix = "✨ **MIMO**: "

    if any(w in msg_lower for w in ["hi", "hello", "hey", "who are you"]):
        intro = f"{persona_prefix}Hello spacefarer! I'm MIMO, your companion in this cosmic universe. I'm ready to help you brainstorm, study, plan your day, and manage tasks."
    elif any(w in msg_lower for w in ["study", "exam", "learn", "feynman"]):
        intro = f"{persona_prefix}Great topic to study! Try using active recall: break this subject into 3 key questions, attempt to explain them without notes, and identify any knowledge gaps."
    elif any(w in msg_lower for w in ["plan", "todo", "task", "schedule"]):
        intro = f"{persona_prefix}Let's get organized! Focus on your #1 highest-impact priority first, block a 25-minute Pomodoro window, and tackle it without distractions."
    elif any(w in msg_lower for w in ["code", "bug", "python", "javascript", "react"]):
        intro = f"{persona_prefix}Nice technical challenge! When debugging, isolate the exact input that triggers the issue, verify data types, and check the most recent stack trace line by line."
    else:
        intro = f"{persona_prefix}I received your thought: \"{message.strip()}\". Let's explore this and take concrete next steps together!"

    cloud_tip = (
        "\n\n---\n"
        "> 🚀 *Notice: You are using MIMO hosted on Render cloud. Because Ollama runs on your private PC, you can either:*\n"
        "> 1. **Run locally on your PC**: Run `node start.js` and open `http://localhost:8000` to connect directly to local Ollama.\n"
        "> 2. **Connect Render to your PC**: Run `npx localtunnel --port 11434` on your PC, then set `OLLAMA_BASE_URL` in your Render Environment."
    )
    return intro + cloud_tip

async def chat_with_ollama(
    message: str,
    bot_id: str = "mimo",
    custom_prompt: Optional[str] = None,
    conversation_history: Optional[List[ChatMessage]] = None
) -> Dict[str, str]:
    """Execute conversational chat via Ollama, Cloud LLM, or fallback companion."""
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

    # 1. Attempt Ollama
    payload = {
        "model": model_tag,
        "messages": messages,
        "stream": False,
        "think": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 512,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            res = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            if res.status_code == 200:
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
    except Exception as e:
        logger.info(f"Ollama direct connection skipped or unavailable ({e}). Checking fallbacks...")

    # 2. Try Cloud LLM (Groq / OpenAI)
    cloud_reply = await call_cloud_llm(messages)
    if cloud_reply:
        return {
            "reply": clean_output(cloud_reply),
            "bot_id": bot_id,
            "model": "cloud-llm"
        }

    # 3. Interactive Fallback Companion
    if ENABLE_CLOUD_FALLBACK:
        return {
            "reply": generate_fallback_chat_reply(message, bot_id),
            "bot_id": bot_id,
            "model": "mimo-companion (cloud preview)"
        }

    raise ConnectionError("Ollama is not running. Please start Ollama on your machine.")

async def breakdown_goal_with_ollama(goal: str) -> List[TaskBreakdownStep]:
    """Break down a user's goal into structured actionable steps with Ollama or fallback."""
    messages = [
        {"role": "system", "content": TASK_BREAKDOWN_SYSTEM_PROMPT},
        {"role": "user", "content": f"Break down this goal into actionable steps: {goal}"}
    ]

    # 1. Try Ollama
    try:
        model_tag = await resolve_active_model()
        payload = {
            "model": model_tag,
            "messages": messages,
            "stream": False,
            "think": False,
            "options": {"temperature": 0.3, "num_predict": 400}
        }
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
            res = await client.post(f"{OLLAMA_BASE_URL}/api/chat", json=payload)
            if res.status_code == 200:
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
                if isinstance(steps_data, list) and len(steps_data) > 0:
                    steps = []
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
                    if steps:
                        return steps
    except Exception:
        pass

    # 2. Try Cloud LLM
    cloud_reply = await call_cloud_llm(messages)
    if cloud_reply:
        match = re.search(r"\[[\s\S]*\]", cloud_reply)
        if match:
            try:
                parsed = json.loads(match.group(0))
                if isinstance(parsed, list):
                    return [
                        TaskBreakdownStep(
                            title=str(item.get("title", f"Step {i+1}"))[:100],
                            description=str(item.get("description", ""))[:300],
                            priority=item.get("priority", "medium")
                        ) for i, item in enumerate(parsed)
                    ]
            except Exception:
                pass

    # 3. Fallback smart decomposition
    return [
        TaskBreakdownStep(title=f"Define core scope for {goal[:40]}", description="Clarify key objectives and desired outcomes.", priority="high"),
        TaskBreakdownStep(title="Gather references and initial materials", description="Collect necessary tools, files, and notes.", priority="medium"),
        TaskBreakdownStep(title="Execute first 30-minute focused sprint", description="Work on the most critical milestone without distractions.", priority="high"),
        TaskBreakdownStep(title="Review progress and calibrate next steps", description="Inspect outcomes, make adjustments, and finalize.", priority="medium")
    ]
