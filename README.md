# MIMO — Personal Local AI Companion

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-6FFF00?style=for-the-badge&logo=render&logoColor=010828)](https://mimo-roo2.onrender.com/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Sivasakthi-Vengatesan/mimo)

🚀 **Live Application Link**: [https://mimo-roo2.onrender.com/](https://mimo-roo2.onrender.com/)

> *"Your personal on-device AI companion in a calm cosmic world. Chat, create assistants, and manage tasks with 100% local privacy."*

MIMO has been completely redesigned with a soft-cosmic aesthetic, deliberate typography, and a clean, uncluttered visual hierarchy. Powered on-device by local Ollama inference (`qwen3.5:2b`), MIMO provides real conversational intelligence, goal breakdown, and custom persona creation without cloud dependencies or subscriptions.

---

## 🎨 Visual Design System

- **Space ink (`#101827`)**: Deep dark foundation providing calm contrast.
- **Starlight (`#F5F2ED`)**: Primary text color for optimal legibility.
- **Nebula aqua (`#B1E5E6`)**: Primary secondary accent for badges, borders, and active highlights.
- **Signal lime (`#D8FF70`)**: Reserved for key actions and real-time live engine indicators.
- **Coral (`#F29191`) & Soft pink (`#F7ADAD`)**: Mascot warmth, high priority flags, and assistant traits.
- **Ice mint (`#CBFAFA`)**: Fresh secondary indicator for productivity states.
- **Typography**: **Plus Jakarta Sans** for display headings, **Inter** for comfortable body text, and **JetBrains Mono** for technical tags.

---

## 🌟 Key Application Experiences

### 1. Overview / Home Hub
- **Unified Composition**: Clean headline, concise description, primary CTA (*"Open Companion Chat"*), and secondary CTA (*"Explore Mini-Bots"*).
- **Single Interactive Mascot**: Vector SVG astronaut creature with reactive mood states (`idle`, `happy`, `thinking`, `curious`, `excited`, `sleepy`), clickable interactions, and dialogue quips.
- **Summary Cards**: Quick task progress, mini-bot launcher, and rotating daily insights.

### 2. Focused Companion Chat
- **Central Conversation Column**: Max-width ~760px optimized for comfortable reading.
- **Persistent Model Indicator**: Live local model badge (`qwen3.5:2b`) with 100% on-device guarantee.
- **Clean Input Controls**: Auto-expanding textarea with Enter to send, Shift+Enter for new lines, and responsive quick-starter chips.
- **Real-Time States**: Animated thinking indicator during inference, error notices with retry action, and clear conversation support.

### 3. Mini-Bot Creator & Gallery
- **3 Core Personas**:
  - **Study Buddy**: Academic revision, Feynman technique, practice quizzes.
  - **Daily Planner**: Schedule architect, task prioritization, burnout prevention.
  - **Coding Pal**: Syntax explanations, bug debugging, software architectures.
- **Assistant Forge**: Clean creation and editing modal for custom bots, system instructions, role presets, and category filters.
- **Persistence**: Saved locally in browser `localStorage`.

### 4. Task Hub & AI Goal Deconstructor
- **Structured Task List**: Compact rows with checkboxes, priority badges (`high`, `medium`, `low`), due dates, inline editing, and deletion.
- **Progress Tracking**: Dynamic completion bar and active filters (`All`, `Active`, `Completed`).
- **AI Task Breakdown ("Break It Down")**: Enter any high-level goal (e.g. *"Study for machine learning exam"*), and local Qwen deconstructs it into actionable sub-tasks with priority tags.
- **Celebration Feedback**: Confetti celebrations on task completion with mascot mood shifts.

### 5. Settings & Privacy
- Custom spacefarer name, companion personality style, visor accent selection, real-time connection status check, and safe factory data reset.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (React 19 + Vite + TypeScript)"]
        UI["Cosmic UI & Interactive Mascot"]
        Chat["Companion Chat Panel"]
        Bots["Mini-Bot Gallery & Forge"]
        Tasks["Task Hub & Goal Deconstructor"]
        Storage[("Local Storage Persistence")]
    end

    subgraph Server["FastAPI Backend (Python 3.11+)"]
        API["FastAPI Application & Uvicorn"]
        Routes["API Endpoints: /api/chat, /api/health, /api/tasks"]
        SPAServe["Static SPA & Assets Mount"]
        Service["Ollama Service & Persona Engine"]
    end

    subgraph Inference["Inference & Intelligence Layer"]
        OllamaDaemon["Local Ollama Daemon (http://localhost:11434)"]
        QwenModel["Qwen 3.5 2B Model (100% On-Device)"]
        CloudFallback["Hybrid / Cloud Fallback (Groq, OpenAI, or Cloud Demo)"]
    end

    UI --> Chat
    UI --> Bots
    UI --> Tasks
    Bots <--> Storage
    Tasks <--> Storage

    Chat -->|"POST /api/chat"| Routes
    Tasks -->|"POST /api/tasks/breakdown"| Routes
    UI -->|"GET /api/health"| Routes
    Client -->|"GET / and /assets/*"| SPAServe

    Routes --> Service
    Service -->|"Primary (Local HTTP API)"| OllamaDaemon
    OllamaDaemon -->|"Sub-second Inference (think=false)"| QwenModel
    Service -.->|"Fallback if Offline / Cloud"| CloudFallback
```

---

## 🔄 Interaction & Data Flow Diagrams

### 1. Companion Chat & Inference Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Spacefarer / User
    participant UI as React UI (ChatPanel)
    participant API as FastAPI Router
    participant Service as Ollama Service
    participant Ollama as Local Ollama Server
    participant Model as Qwen 3.5 (2B)

    User->>UI: Types message & presses Enter
    UI->>UI: Optimistic render message + Mascot transitions to Thinking
    UI->>API: POST /api/chat (message, bot_id, bounded_history)
    API->>Service: Resolve active model & format persona prompt
    Service->>Ollama: POST /api/chat (think=false, stream=false, num_predict=512)
    Ollama->>Model: Execute on-device neural inference
    Model-->>Ollama: Raw token output
    Ollama-->>Service: HTTP 200 JSON Response
    Service->>Service: Strip reasoning tags (<think>...</think>)
    Service-->>API: Clean structured reply
    API-->>UI: 200 OK (reply, bot_id, model)
    UI->>UI: Append reply + Mascot transitions to Happy / Curious
    UI-->>User: Displays response with zero cloud latency
```

### 2. AI Goal Deconstructor ("Break It Down") Flow

```mermaid
flowchart LR
    Goal["High-Level Goal\n(e.g., 'Study for ML Exam')"] --> Modal["TaskBreakdownModal"]
    Modal --> API["POST /api/tasks/breakdown"]
    API --> SystemPrompt["System Prompt\n(JSON Schema Directive)"]
    SystemPrompt --> Engine["Ollama / Qwen 3.5 Inference"]
    Engine --> Parser["JSON Array Parser & Validator"]
    Parser --> Steps["Structured Sub-Tasks\n(Title, Description, Priority)"]
    Steps --> TaskBoard["Task Board & Confetti Celebration"]
```

---

## 🚀 Startup Commands (Windows PowerShell)

### Option 1: Unified Full-Stack Runner (Recommended)
```powershell
node start.js --port 8000
```
Visit **`http://localhost:8000/`** — serves both the production React UI and FastAPI backend on a single port connected to your local Ollama.

### Option 2: Development Mode (Hot Reload)

#### Backend
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend
```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Visit **`http://127.0.0.1:5173/`** to interact with MIMO.

---

## 🌐 Live Cloud Deployment

- **Production URL**: [https://mimo-roo2.onrender.com/](https://mimo-roo2.onrender.com/)
- **Hosting Platform**: [Render](https://render.com/)
- **API Health Check**: [https://mimo-roo2.onrender.com/api/health](https://mimo-roo2.onrender.com/api/health)


