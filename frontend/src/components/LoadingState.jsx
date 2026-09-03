function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__visual">
        <div className="loading-state__pulse-ring" aria-hidden="true" />
        <div className="loading-state__spinner" aria-hidden="true" />
      </div>

      <h3 className="loading-state__title">Analyzing Website Architecture</h3>
      <p className="loading-state__text">
        Scraping DOM nodes, computing deterministic metrics, and generating
        actionable insights with Gemini AI…
      </p>

      <div className="loading-state__steps">
        <div className="loading-state__step">
          <span className="loading-state__step-dot" />
          <span>Scraping DOM</span>
        </div>
        <div className="loading-state__step">
          <span className="loading-state__step-dot" />
          <span>Factual Metrics</span>
        </div>
        <div className="loading-state__step">
          <span className="loading-state__step-dot" />
          <span>Gemini AI Synthesis</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
