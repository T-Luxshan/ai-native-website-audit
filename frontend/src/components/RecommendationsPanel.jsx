function RecommendationsPanel({ recommendations }) {
  if (!recommendations?.length) return null

  const sorted = [...recommendations].sort((a, b) => a.priority - b.priority)

  const priorityMeta = {
    1: { label: 'Priority 1 · Critical Impact', classSuffix: 'p1' },
    2: { label: 'Priority 2 · High Value', classSuffix: 'p2' },
    3: { label: 'Priority 3 · Optimization', classSuffix: 'p3' },
  }

  return (
    <ol className="recommendations-list">
      {sorted.map((item) => {
        const meta = priorityMeta[item.priority] || {
          label: `Priority ${item.priority}`,
          classSuffix: 'p2',
        }

        return (
          <li
            key={`${item.priority}-${item.title}`}
            className={`recommendation-item recommendation-item--priority-${item.priority}`}
          >
            <div className="recommendation-item__badge-row">
              <span className={`recommendation-badge recommendation-badge--${meta.classSuffix}`}>
                {meta.label}
              </span>
            </div>
            <h4 className="recommendation-item__title">{item.title}</h4>
            <p className="recommendation-item__reasoning">{item.reasoning}</p>
          </li>
        )
      })}
    </ol>
  )
}

export default RecommendationsPanel
