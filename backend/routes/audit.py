from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from ai_analyzer import AIAnalyzerError, analyze_page
from models import AuditRequest, AuditResponse
from scraper import ScraperError, scrape_page

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}
@router.post("/api/audit", response_model=AuditResponse)
def run_audit(request: AuditRequest):
    url = str(request.url)

    try:
        scrape_result = scrape_page(url)
    except ScraperError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    try:
        analysis = analyze_page(scrape_result)
    except AIAnalyzerError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return AuditResponse(
        url=scrape_result["url"],
        audited_at=datetime.now(timezone.utc),
        metrics=scrape_result["metrics"],
        insights={
            "seo_structure": analysis.seo_structure.model_dump(),
            "messaging_clarity": analysis.messaging_clarity.model_dump(),
            "cta_usage": analysis.cta_usage.model_dump(),
            "content_depth": analysis.content_depth.model_dump(),
            "ux_concerns": analysis.ux_concerns.model_dump(),
        },
        recommendations=analysis.recommendations,
    )
