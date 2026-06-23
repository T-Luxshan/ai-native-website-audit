function RecommendationsPanel({ recommendations }) {
  if (!recommendations?.length) return null

  const sorted = [...recommendations].sort(
    (a, b) => a.priority - b.priority,
  )

  return (
    <ol className="recommendations-list">
      {sorted.map((item) => (
        <li key={`${item.priority}-${item.title}`} className="recommendation-item">
          <span className="recommendation-item__badge">Priority {item.priority}</span>
          <h3 className="recommendation-item__title">{item.title}</h3>
          <p className="recommendation-item__reasoning">{item.reasoning}</p>
        </li>
      ))}
    </ol>
  )
}

export default RecommendationsPanel
