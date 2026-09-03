function MetricCard({ label, value, badge, badgeType, icon }) {
  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        {icon && <span className="metric-card__icon" aria-hidden="true">{icon}</span>}
      </div>
      <div className="metric-card__value">{value}</div>
      {badge && (
        <span className={`metric-card__badge metric-card__badge--${badgeType || 'good'}`}>
          {badge}
        </span>
      )}
    </div>
  )
}

function MetricsPanel({ metrics }) {
  if (!metrics) return null

  const { headings } = metrics
  const missingAlt = Number(metrics.images_missing_alt_pct) || 0

  let altBadgeType = 'good'
  let altBadgeText = 'Healthy'
  if (missingAlt > 30) {
    altBadgeType = 'danger'
    altBadgeText = 'Needs Alt Text'
  } else if (missingAlt > 0) {
    altBadgeType = 'warning'
    altBadgeText = 'Partial'
  }

  const h1Count = headings?.h1 ?? 0
  const h1BadgeType = h1Count === 1 ? 'good' : h1Count === 0 ? 'danger' : 'warning'
  const h1BadgeText = h1Count === 1 ? 'Optimal (1)' : h1Count === 0 ? 'Missing H1' : 'Multiple H1s'

  return (
    <div className="metrics-dashboard">
      <div className="metrics-grid">
        <MetricCard
          label="Total Word Count"
          value={metrics.word_count.toLocaleString()}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          }
        />

        <MetricCard
          label="H1 Headings"
          value={headings?.h1 ?? 0}
          badge={h1BadgeText}
          badgeType={h1BadgeType}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="m17 12 3-2v8" />
            </svg>
          }
        />

        <MetricCard
          label="H2 Headings"
          value={headings?.h2 ?? 0}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="M21 18h-4c0-4 4-3 4-6 0-1.5-1-2.5-2.5-2.5S16 10.5 16 12" />
            </svg>
          }
        />

        <MetricCard
          label="H3 Headings"
          value={headings?.h3 ?? 0}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h8" />
              <path d="M4 18V6" />
              <path d="M12 18V6" />
              <path d="M17.5 10.5c.8-.5 1.5-1.2 1.5-2.5 0-1.7-1.3-2-2.5-2H16v6h1.5" />
              <path d="M16 12h1.5c1.4 0 2.5.3 2.5 2 0 1.5-1 2-2.5 2H16" />
            </svg>
          }
        />

        <MetricCard
          label="Call-To-Actions (CTAs)"
          value={metrics.cta_count}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M8 12h8" />
              <path d="m13 9 3 3-3 3" />
            </svg>
          }
        />

        <MetricCard
          label="Internal Links"
          value={metrics.internal_links}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          }
        />

        <MetricCard
          label="External Links"
          value={metrics.external_links}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          }
        />

        <MetricCard
          label="Total Images"
          value={metrics.image_count}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          }
        />

        <MetricCard
          label="Images Missing Alt"
          value={`${missingAlt}%`}
          badge={altBadgeText}
          badgeType={altBadgeType}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          }
        />
      </div>

      {/* Meta Tags SERP Preview */}
      <div className="meta-preview-box">
        <div className="meta-preview-box__title-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search Engine Meta Preview</span>
        </div>
        <div className="meta-preview-box__title">
          {metrics.meta_title || 'No Meta Title Found'}
        </div>
        <p className="meta-preview-box__desc">
          {metrics.meta_description || 'No meta description provided for this web page.'}
        </p>
      </div>
    </div>
  )
}

export default MetricsPanel
