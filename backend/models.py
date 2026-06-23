from pydantic import BaseModel, Field, field_validator


class InsightSection(BaseModel):
    summary: str
    details: str


class Recommendation(BaseModel):
    priority: int = Field(ge=1, le=5)
    title: str
    reasoning: str


class AIAnalysis(BaseModel):
    seo_structure: InsightSection
    messaging_clarity: InsightSection
    cta_usage: InsightSection
    content_depth: InsightSection
    ux_concerns: InsightSection
    recommendations: list[Recommendation] = Field(min_length=3, max_length=5)

    @field_validator("recommendations")
    @classmethod
    def sort_recommendations_by_priority(cls, value: list[Recommendation]) -> list[Recommendation]:
        return sorted(value, key=lambda item: item.priority)


class AuditRequest(BaseModel):
    url: str
