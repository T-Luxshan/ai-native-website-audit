const INSIGHT_SECTIONS = [
  {
    key: 'seo_structure',
    title: 'SEO Structure',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    key: 'messaging_clarity',
    title: 'Messaging Clarity',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    key: 'cta_usage',
    title: 'CTA Strategy & Usage',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    key: 'content_depth',
    title: 'Content Depth',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    key: 'ux_concerns',
    title: 'UX & Structural Concerns',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
]

function InsightsPanel({ insights }) {
  if (!insights) return null

  return (
    <div className="insights-list">
      {INSIGHT_SECTIONS.map(({ key, title, icon }) => {
        const section = insights[key]
        if (!section) return null

        return (
          <article key={key} className="insight-card">
            <div className="insight-card__header">
              <span className="insight-card__icon" aria-hidden="true">{icon}</span>
              <h3 className="insight-card__title">{title}</h3>
            </div>
            <div className="insight-card__summary">{section.summary}</div>
            <p className="insight-card__details">{section.details}</p>
          </article>
        )
      })}
    </div>
  )
}

export default InsightsPanel
