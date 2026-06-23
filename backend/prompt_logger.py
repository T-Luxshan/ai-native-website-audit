import json
import re
from datetime import datetime, timezone
from pathlib import Path

LOG_DIR = Path(__file__).parent / "prompt_logs"

REDACT_PATTERNS = (
    (re.compile(r"(GEMINI_API_KEY\s*=\s*)(\S+)", re.I), r"\1[REDACTED]"),
    (re.compile(r"(api[_-]?key['\"]?\s*[:=]\s*['\"]?)(\S+)", re.I), r"\1[REDACTED]"),
    (re.compile(r"\bAIza[0-9A-Za-z\-_]{20,}\b"), "[REDACTED]"),
)


def _redact_text(text: str) -> str:
    redacted = text
    for pattern, replacement in REDACT_PATTERNS:
        redacted = pattern.sub(replacement, redacted)
    return redacted


def _redact_value(value):
    if isinstance(value, str):
        return _redact_text(value)
    if isinstance(value, dict):
        return {key: _redact_value(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_redact_value(item) for item in value]
    return value


def log_prompt_trace(
    url: str,
    system_prompt: str,
    user_prompt: str,
    structured_inputs: dict,
    raw_model_output: str,
) -> Path:
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    safe_host = re.sub(r"[^a-zA-Z0-9]+", "-", url.split("//")[-1]).strip("-")[:40]
    log_path = LOG_DIR / f"audit-{timestamp}-{safe_host}.json"

    payload = {
        "url": url,
        "logged_at": datetime.now(timezone.utc).isoformat(),
        "system_prompt": _redact_text(system_prompt),
        "user_prompt": _redact_text(user_prompt),
        "structured_inputs": _redact_value(structured_inputs),
        "raw_model_output": _redact_text(raw_model_output),
    }

    log_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return log_path
