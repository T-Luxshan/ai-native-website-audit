const INSIGHT_SECTIONS = [
  { key: 'seo_structure', title: 'SEO structure' },
  { key: 'messaging_clarity', title: 'Messaging clarity' },
  { key: 'cta_usage', title: 'CTA usage' },
  { key: 'content_depth', title: 'Content depth' },
  { key: 'ux_concerns', title: 'UX & structural concerns' },
]

function InsightsPanel({ insights }) {
  if (!insights) return null

  return (
    <div className="insights-list">
      {INSIGHT_SECTIONS.map(({ key, title }) => {
        const section = insights[key]
        if (!section) return null

        return (
          <article key={key} className="insight-card">
            <h3 className="insight-card__title">{title}</h3>
            <p className="insight-card__summary">{section.summary}</p>
            <p className="insight-card__details">{section.details}</p>
          </article>
        )
      })}
    </div>
  )
}

export default InsightsPanel
