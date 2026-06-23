import json
import os
import re
import time
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import ValidationError

from models import AIAnalysis
from prompt_logger import log_prompt_trace

load_dotenv()

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

SYSTEM_PROMPT = """You are a senior web strategist at a digital marketing agency.
You analyze webpages for SEO, messaging clarity, CTA effectiveness,
content depth, and UX quality. Always ground your analysis in the
specific metrics provided. Never give generic advice.

Analyze the provided webpage using ONLY the factual metrics and page excerpt supplied. Your job is to produce actionable, agency-quality audit insights.

Rules:
- Ground every insight in the provided metrics. Reference specific numbers (word count, heading counts, CTA count, link counts, image alt %, meta fields).
- Be specific to this page. Do not give generic advice that could apply to any website.
- If a metric is weak or missing, say so explicitly and tie it to business impact.
- Provide exactly 3 to 5 prioritized recommendations with clear reasoning tied to the metrics.
- Return JSON only, matching this schema:
{
  "seo_structure": {"summary": "...", "details": "..."},
  "messaging_clarity": {"summary": "...", "details": "..."},
  "cta_usage": {"summary": "...", "details": "..."},
  "content_depth": {"summary": "...", "details": "..."},
  "ux_concerns": {"summary": "...", "details": "..."},
  "recommendations": [
    {"priority": 1, "title": "...", "reasoning": "..."}
  ]
}
"""

RETRY_SUFFIX = """
Your previous response was invalid or did not match the required JSON schema.
Return ONLY valid JSON matching the schema exactly.
Include 3 to 5 recommendations with priority values 1-5.
Every insight must reference specific metric values from the input.
"""


class AIAnalyzerError(Exception):
    """Raised when Gemini analysis fails."""


def _get_model() -> genai.GenerativeModel:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your_key_here":
        raise AIAnalyzerError("GEMINI_API_KEY is not configured")

    genai.configure(api_key=api_key)
    return genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_PROMPT)


def build_user_prompt(scrape_result: dict) -> str:
    metrics = scrape_result["metrics"]
    return f"""Audit this single webpage.

URL: {scrape_result["url"]}

FACTUAL METRICS (use these numbers in your analysis):
{json.dumps(metrics, indent=2)}

PAGE TEXT EXCERPT:
{scrape_result.get("page_text_excerpt", "")}

Produce insights for:
1. SEO structure
2. Messaging clarity
3. CTA usage
4. Content depth
5. Obvious UX or structural concerns

Also provide 3-5 prioritized recommendations. Each recommendation must explain why it matters using the metrics above.
Return JSON only.
"""


def _parse_analysis(raw_text: str) -> AIAnalysis:
    try:
        payload = json.loads(raw_text)
    except json.JSONDecodeError as exc:
        raise AIAnalyzerError("Model returned invalid JSON") from exc

    try:
        return AIAnalysis.model_validate(payload)
    except ValidationError as exc:
        raise AIAnalyzerError(f"Model JSON did not match schema: {exc}") from exc


def _format_api_error(exc: Exception) -> str:
    message = str(exc)
    if "429" in message or "quota" in message.lower():
        return (
            "Gemini API rate limit or free-tier quota exceeded. "
            f"Try again in a minute, set GEMINI_MODEL to gemini-2.5-flash-lite, "
            f"or check usage at https://ai.dev/rate-limit. Details: {message[:300]}"
        )
    return f"Gemini API request failed: {message}"


def _retry_delay_seconds(exc: Exception) -> Optional[float]:
    match = re.search(r"retry in ([0-9.]+)s", str(exc), re.I)
    if match:
        return min(float(match.group(1)) + 1, 60)
    return None


def _call_model(model: genai.GenerativeModel, prompt: str) -> str:
    last_error = None
    for attempt in range(2):
        try:
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"},
            )
            raw_text = (response.text or "").strip()
            if not raw_text:
                raise AIAnalyzerError("Gemini API returned an empty response")
            return raw_text
        except AIAnalyzerError:
            raise
        except Exception as exc:
            last_error = exc
            delay = _retry_delay_seconds(exc)
            if attempt == 0 and delay is not None:
                time.sleep(delay)
                continue
            raise AIAnalyzerError(_format_api_error(exc)) from exc

    raise AIAnalyzerError(_format_api_error(last_error))


def analyze_page(scrape_result: dict) -> AIAnalysis:
    model = _get_model()
    user_prompt = build_user_prompt(scrape_result)
    structured_inputs = {
        "url": scrape_result["url"],
        "metrics": scrape_result["metrics"],
        "page_text_excerpt": scrape_result.get("page_text_excerpt", ""),
    }

    raw_output = _call_model(model, user_prompt)

    try:
        analysis = _parse_analysis(raw_output)
    except AIAnalyzerError:
        retry_prompt = f"{user_prompt}\n\n{RETRY_SUFFIX}\n\nPrevious invalid output:\n{raw_output}"
        raw_output = _call_model(model, retry_prompt)
        analysis = _parse_analysis(raw_output)

    log_prompt_trace(
        url=scrape_result["url"],
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        structured_inputs=structured_inputs,
        raw_model_output=raw_output,
    )

    return analysis


if __name__ == "__main__":
    from scraper import scrape_page

    test_url = "https://example.com"
    scraped = scrape_page(test_url)
    result = analyze_page(scraped)
    print(json.dumps(result.model_dump(), indent=2))
