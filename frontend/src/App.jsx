import { useState } from 'react'
import { auditUrl } from './api/auditApi.js'
import ErrorBanner from './components/ErrorBanner.jsx'
import InsightsPanel from './components/InsightsPanel.jsx'
import LoadingState from './components/LoadingState.jsx'
import MetricsPanel from './components/MetricsPanel.jsx'
import RecommendationsPanel from './components/RecommendationsPanel.jsx'
import UrlForm from './components/UrlForm.jsx'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [auditResult, setAuditResult] = useState(null)

  async function handleSubmit(url) {
    setLoading(true)
    setError('')
    setAuditResult(null)

    try {
      const result = await auditUrl(url)
      setAuditResult(result)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Website Audit Tool</h1>
        <p>
          Enter a single page URL to extract factual metrics and generate
          AI-powered insights and recommendations.
        </p>
      </header>

      <UrlForm onSubmit={handleSubmit} loading={loading} />

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {loading && <LoadingState />}

      {auditResult && !loading && (
        <div className="results">
          <p className="results__meta">
            Audited <strong>{auditResult.url}</strong>
          </p>

          <section className="panel panel--metrics" aria-labelledby="metrics-heading">
            <h2 id="metrics-heading" className="panel__heading">
              Factual Metrics
            </h2>
            <p className="panel__subtitle">
              Extracted directly from the page — not AI-generated.
            </p>
            <MetricsPanel metrics={auditResult.metrics} />
          </section>

          <section className="panel panel--ai" aria-labelledby="ai-heading">
            <h2 id="ai-heading" className="panel__heading">
              AI Analysis
            </h2>
            <p className="panel__subtitle">
              Insights and recommendations generated from the metrics above.
            </p>
            <InsightsPanel insights={auditResult.insights} />
            <h3 className="panel__subheading">Recommendations</h3>
            <RecommendationsPanel recommendations={auditResult.recommendations} />
          </section>
        </div>
      )}
    </div>
  )
}

export default App
