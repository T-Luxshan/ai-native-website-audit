function MetricItem({ label, value }) {
  return (
    <div className="metric-item">
      <dt className="metric-item__label">{label}</dt>
      <dd className="metric-item__value">{value}</dd>
    </div>
  )
}

function MetricsPanel({ metrics }) {
  if (!metrics) return null

  const { headings } = metrics

  return (
    <dl className="metrics-grid">
      <MetricItem label="Total word count" value={metrics.word_count} />
      <MetricItem label="H1 headings" value={headings.h1} />
      <MetricItem label="H2 headings" value={headings.h2} />
      <MetricItem label="H3 headings" value={headings.h3} />
      <MetricItem label="CTAs" value={metrics.cta_count} />
      <MetricItem label="Internal links" value={metrics.internal_links} />
      <MetricItem label="External links" value={metrics.external_links} />
      <MetricItem label="Images" value={metrics.image_count} />
      <MetricItem
        label="Images missing alt text"
        value={`${metrics.images_missing_alt_pct}%`}
      />
      <MetricItem label="Meta title" value={metrics.meta_title || '—'} />
      <MetricItem
        label="Meta description"
        value={metrics.meta_description || '—'}
      />
    </dl>
  )
}

export default MetricsPanel
