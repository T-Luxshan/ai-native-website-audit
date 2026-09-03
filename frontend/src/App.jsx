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

  function handleReset() {
    setAuditResult(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      {/* Top Navigation */}
      <header className="navbar">
        <div className="brand-badge">
          <div className="brand-badge__icon" aria-hidden="true">
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <span className="brand-badge__text">Audit AI</span>
        </div>

        <div className="model-pill">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="m12 2 2.6 5.8L20 10.5l-5.4 2.7L12 19l-2.6-5.8L4 10.5l5.4-2.7L12 2z" />
          </svg>
          <span>Powered by Gemini</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero__title">AI-Powered Website Auditing</h1>
        <p className="hero__subtitle">
          Analyze SEO, Accessibility, Content Quality and User Experience in
          seconds using deterministic analysis and Gemini AI.
        </p>

        {/* Feature Pills */}
        <div className="feature-chips" aria-label="Auditing Capabilities">
          <span className="feature-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            SEO
          </span>
          <span className="feature-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="4" r="2" />
              <path d="M18 19v-4a4 4 0 0 0-8 0v4" />
              <path d="M6 10h12" />
            </svg>
            Accessibility
          </span>
          <span className="feature-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            Content
          </span>
          <span className="feature-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            UX
          </span>
          <span className="feature-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Gemini AI
          </span>
        </div>
      </section>

      {/* Main Audit Search Bar */}
      <UrlForm onSubmit={handleSubmit} loading={loading} />

      {/* Error Notifications */}
      <ErrorBanner message={error} onDismiss={() => setError('')} />

      {/* Loading Radar Scanner */}
      {loading && <LoadingState />}

      {/* Audit Results */}
      {auditResult && !loading && (
        <main className="results" id="audit-results">
          <div className="results-header">
            <div className="results-header__info">
              <span className="results-header__badge">
                <span className="results-header__dot" />
                Audit Completed
              </span>
              <span className="results-header__url">
                Audited <strong>{auditResult.url}</strong>
              </span>
            </div>
            <button
              type="button"
              className="url-preset-btn"
              onClick={handleReset}
              style={{ textDecoration: 'none', color: '#a5b4fc', fontWeight: 600 }}
            >
              ← Run Another Audit
            </button>
          </div>

          {/* Mandatory Factual Metrics Section */}
          <section className="panel panel--metrics" aria-labelledby="metrics-heading">
            <div className="panel__header">
              <div className="panel__title-group">
                <h2 id="metrics-heading" className="panel__heading">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                  Factual Metrics
                </h2>
                <p className="panel__subtitle">
                  Extracted directly from the page DOM — completely deterministic and not AI-generated.
                </p>
              </div>
              <span className="panel__tag panel__tag--metrics">Deterministic</span>
            </div>

            <MetricsPanel metrics={auditResult.metrics} />
          </section>

          {/* Mandatory AI Insights & Recommendations Section */}
          <section className="panel panel--ai" aria-labelledby="ai-heading">
            <div className="panel__header">
              <div className="panel__title-group">
                <h2 id="ai-heading" className="panel__heading">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2">
                    <path d="m12 3 2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3z" />
                  </svg>
                  AI Intelligence & Analysis
                </h2>
                <p className="panel__subtitle">
                  Strategic insights and qualitative analysis grounded in the factual metrics above.
                </p>
              </div>
              <span className="panel__tag panel__tag--ai">Gemini AI</span>
            </div>

            <InsightsPanel insights={auditResult.insights} />

            <h3 className="panel__subheading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 14 14" />
              </svg>
              Prioritized Recommendations
            </h3>
            <RecommendationsPanel recommendations={auditResult.recommendations} />
          </section>
        </main>
      )}
    </div>
  )
}

export default App
