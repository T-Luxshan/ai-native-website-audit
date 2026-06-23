# AI-Native Website Audit Tool

A lightweight AI-powered tool that audits a **single webpage**: it extracts factual metrics via scraping, then uses Google Gemini to generate grounded insights and prioritized recommendations. Built for the EIGHT25MEDIA AI-Native Software Engineer assignment.

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** (Vercel) | https://ai-native-website-audit.vercel.app |
| **Backend API** (Render) | https://ai-native-website-audit.onrender.com |

## What It Does

1. Accept a single URL
2. **Scrape** the page and extract factual metrics (word count, headings, CTAs, links, images, meta tags)
3. **Analyze** with Gemini using structured prompts grounded in those metrics
4. **Display** results with a clear separation between factual data and AI-generated content

---

## Architecture Overview

```
User → React (Vite) → FastAPI → scraper.py → ai_analyzer.py → Gemini
                              ↓                    ↓
                         metrics JSON      prompt_logger.py
```

### Flow

1. **Frontend** — User submits a URL. React calls `POST /api/audit` on the FastAPI backend.
2. **Scraper** (`backend/scraper.py`) — Fetches HTML with `requests`, parses with BeautifulSoup4, returns structured metrics and a text excerpt. No AI involved.
3. **AI Analyzer** (`backend/ai_analyzer.py`) — Sends metrics + excerpt to Gemini with a system prompt and JSON schema. Validates the response with Pydantic.
4. **Prompt Logger** (`backend/prompt_logger.py`) — Writes a timestamped JSON trace of every successful audit (system prompt, user prompt, inputs, raw output).
5. **API** (`backend/routes/audit.py`) — Combines scraper output and AI analysis into one response with separate `metrics`, `insights`, and `recommendations` keys.
6. **Frontend** — Renders **Factual Metrics** and **AI Analysis** in visually distinct panels.

### Project Structure

```
ai-native-website-audit/
├── backend/
│   ├── main.py              # FastAPI app, CORS
│   ├── scraper.py           # Page fetching + metric extraction
│   ├── ai_analyzer.py       # Gemini prompts + API call
│   ├── prompt_logger.py     # Reasoning trace logs
│   ├── models.py            # Pydantic schemas
│   └── routes/audit.py      # /health, /api/audit
├── frontend/
│   └── src/
│       ├── api/auditApi.js
│       └── components/      # UrlForm, MetricsPanel, InsightsPanel, etc.
└── prompt_logs/
    └── sample-audit-log.json  # Submitted prompt trace example
```

---

## AI Design Decisions

### Separation of concerns

Scraping and AI analysis are fully decoupled. The scraper returns a plain dict; the AI module never fetches URLs. This keeps factual metrics deterministic and prevents the model from inventing numbers.

### Grounding strategy

The model receives **only**:
- Structured metrics JSON (word count, headings, CTAs, links, images, meta fields)
- A ~3000-character page text excerpt

The system prompt explicitly requires referencing specific metric values and forbids generic advice. Insights must cite numbers from the input (e.g. "88.6% of images missing alt text").

### Prompt structure

| Layer | Purpose |
|-------|---------|
| **System prompt** | Sets agency auditor role, grounding rules, JSON schema |
| **User prompt** | Injects URL, metrics JSON, page excerpt, and output instructions |

### Structured output

- Gemini is called with `response_mime_type: application/json`
- Response is validated against a Pydantic `AIAnalysis` model (5 insight categories + 3–5 recommendations)
- On parse/validation failure, the API retries once with the invalid output included in the follow-up prompt

### Model choice

**Default:** `gemini-2.5-flash-lite` (configurable via `GEMINI_MODEL`)

- Free-tier friendly with lower token cost
- Sufficient for structured audit JSON
- `gemini-1.5-flash` and `gemini-2.0-flash` were deprecated or had zero free-tier quota during development

### Prompt logs

Every successful audit writes a JSON file to `backend/prompt_logs/` containing:
- `system_prompt`
- `user_prompt`
- `structured_inputs`
- `raw_model_output`

API keys are redacted before writing. A sample log is committed at [`prompt_logs/sample-audit-log.json`](prompt_logs/sample-audit-log.json) for submission.

---

## Trade-offs

| Decision | Trade-off |
|----------|-----------|
| **BeautifulSoup + requests** | Fast and simple, but cannot render JavaScript-heavy SPAs. Pages built client-side may return incomplete metrics. |
| **CTA heuristics** | Buttons, submit inputs, and link text/class patterns are counted — not a perfect measure of "primary actions" but practical without browser automation. |
| **3000-char excerpt** | Limits token cost and stays within free-tier quotas, but the model may miss content below the fold. |
| **Single-page only** | Keeps scope focused; no multi-page crawling or site-wide analysis. |
| **Sync API endpoint** | Simple to deploy; a long Gemini call blocks the request (~10–30s). Acceptable for a demo tool. |
| **Render free tier** | Cold starts (~30s) after idle periods. First request after sleep may feel slow. |
| **Deprecated `google-generativeai` SDK** | Still works for this assignment; Google recommends migrating to `google.genai` long-term. |
| **Ephemeral prompt logs on Render** | Runtime logs are lost on redeploy; the committed `sample-audit-log.json` serves as the permanent deliverable. |

---

## What I Would Improve With More Time

1. **Playwright for scraping** — Render JavaScript before extracting metrics (fixes SPA gaps).
2. **Better CTA detection** — Use visual/semantic signals (position, styling) instead of text heuristics alone.
3. **Caching** — Cache scrape + AI results by URL to reduce API cost and latency on repeat audits.
4. **Rate limiting** — Protect the public API from abuse (SSRF and quota exhaustion).
5. **Migrate to `google.genai` SDK** — Replace the deprecated `google-generativeai` package.
6. **Async processing** — Queue audits and poll for results so the UI doesn't block on long Gemini calls.
7. **PDF/export** — Downloadable audit report for client delivery.

---

## Local Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Backend

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
cp .env.example .env   # then add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

**Backend env vars** (`backend/.env`):

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Model name (default: `gemini-2.5-flash-lite`) |
| `CORS_ORIGINS` | Comma-separated allowed origins (e.g. `http://localhost:5173`) |

API docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

**Frontend env vars** (`frontend/.env`):

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (default: `http://localhost:8000`) |

Open http://localhost:5173

---

## Deployment

### Backend (Render)

| Setting | Value |
|---------|-------|
| Root directory | `backend` |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| Env vars | `GEMINI_API_KEY`, `GEMINI_MODEL`, `CORS_ORIGINS` |

Set `CORS_ORIGINS` to your Vercel frontend URL after deploying the frontend.

### Frontend (Vercel)

| Setting | Value |
|---------|-------|
| Root directory | `frontend` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Env var | `VITE_API_URL` = your Render backend URL |

---

## API Reference

### `GET /health`

```json
{ "status": "ok" }
```

### `POST /api/audit`

**Request:**
```json
{ "url": "https://example.com" }
```

**Response:**
```json
{
  "url": "https://example.com/",
  "audited_at": "2026-06-23T12:00:00Z",
  "metrics": { },
  "insights": {
    "seo_structure": { "summary": "...", "details": "..." },
    "messaging_clarity": { "summary": "...", "details": "..." },
    "cta_usage": { "summary": "...", "details": "..." },
    "content_depth": { "summary": "...", "details": "..." },
    "ux_concerns": { "summary": "...", "details": "..." }
  },
  "recommendations": [
    { "priority": 1, "title": "...", "reasoning": "..." }
  ]
}
```

---

## Prompt Logs Deliverable

See [`prompt_logs/sample-audit-log.json`](prompt_logs/sample-audit-log.json) for a complete reasoning trace showing:

- System prompt used
- User prompt as constructed
- Structured inputs sent to the model
- Raw model output before formatting

New logs are auto-generated in `backend/prompt_logs/` after each successful audit.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite (JavaScript) |
| Backend | Python + FastAPI |
| Scraping | BeautifulSoup4 + requests |
| AI | Google Gemini via `google-generativeai` |
| Deployment | Vercel (frontend) + Render (backend) |

---

## License

Built as a take-home assignment for EIGHT25MEDIA. Not intended for production use.
