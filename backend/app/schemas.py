from typing import List, Optional
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str
    ollama_connected: bool
    configured_model: str
    model_available: bool
    available_models: List[str] = []
    error: Optional[str] = None

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: str = Field(..., min_length=1)

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    bot_id: str = Field(default="mimo")
    custom_prompt: Optional[str] = Field(default=None, max_length=4000)
    conversation_history: List[ChatMessage] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    bot_id: str
    model: str

class TaskBreakdownRequest(BaseModel):
    goal: str = Field(..., min_length=2, max_length=500)

class TaskBreakdownStep(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default="", max_length=300)
    priority: str = Field(default="medium", pattern="^(high|medium|low)$")

class TaskBreakdownResponse(BaseModel):
    goal: str
    steps: List[TaskBreakdownStep]
    model: str
