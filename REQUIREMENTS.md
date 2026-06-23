# Project Requirements

## Objective

Build a lightweight AI-powered Website Audit Tool that accepts a single URL, extracts and displays key factual metrics, and uses AI to generate structured insights and recommendations. The goal is to evaluate how you structure AI-driven systems, not to build a production-ready product.

## Mandatory Features

### 1. Factual Metrics

Your tool must extract and clearly display key metrics such as:

- Total word count
- Heading counts (H1–H3)
- Number of CTAs (buttons or primary action links)
- Number of internal vs external links
- Number of images
- % of images missing alt text
- Meta title and meta description

These metrics must be clearly separated from AI-generated insights.

### 2. AI Insights

Using the extracted data and page content, generate a structured analysis covering:

- SEO structure
- Messaging clarity
- CTA usage
- Content depth
- Obvious UX or structural concerns

Insights must:

- Be grounded in the extracted metrics
- Be specific and non-generic
- Clearly reference the factual data

### 3. Recommendations

Provide:

- 3–5 prioritized recommendations
- Clear reasoning tied to extracted metrics

Recommendations should be actionable and concise.

## Interface Requirements

Provide one of the following:

- Deployed web app link
- Local web app with clear setup instructions
- CLI tool
- API endpoint returning structured output

## Deliverables Checklist

- [ ] GitHub repository
- [ ] Deployed link or runnable instructions
- [ ] README including:
  - [ ] Architecture overview
  - [ ] AI design decisions
  - [ ] Trade-offs
  - [ ] What would you improve with more time
- [ ] Prompt logs/reasoning traces that show:
  - [ ] The system prompt(s) used
  - [ ] The user prompt(s) were constructed
  - [ ] The structured inputs sent to the model
  - [ ] The raw model outputs (before formatting, if applicable)
  - [ ] API keys or sensitive information may be redacted

## Evaluation Criteria

We are assessing:

- AI-native thinking (not just API usage)
- Ability to ground AI in structured data
- Code quality and organization
- Quality and usefulness of insights
- Practical relevance to a web agency

We are evaluating:

- Clean separation between scraping and AI analysis
- Structured outputs
- Prompt design quality
- Engineering clarity
- Thoughtful trade-offs
- Keep the solution simple and practical

## Out of Scope

- Multi-page crawling (analyze a single page only)
- Production-ready product
