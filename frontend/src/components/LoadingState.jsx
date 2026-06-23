function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__spinner" aria-hidden="true" />
      <p className="loading-state__text">
        Analyzing page… This may take 10–30 seconds while we scrape the page and
        generate AI insights.
      </p>
    </div>
  )
}

export default LoadingState
