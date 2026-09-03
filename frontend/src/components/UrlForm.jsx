import { useState } from 'react'

function isValidUrl(value) {
  return value.startsWith('http://') || value.startsWith('https://')
}

const SAMPLE_URLS = [
  'https://stripe.com',
  'https://github.com',
  'https://vercel.com',
]

function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    let trimmed = url.trim()

    if (!trimmed) {
      setValidationError('Please enter a website URL.')
      return
    }

    // Auto-prefix https:// if user simply entered "example.com"
    if (!isValidUrl(trimmed)) {
      if (trimmed.includes('.') && !trimmed.includes(' ')) {
        trimmed = `https://${trimmed}`
        setUrl(trimmed)
      } else {
        setValidationError('Please enter a valid URL (e.g. https://example.com).')
        return
      }
    }

    setValidationError('')
    onSubmit(trimmed)
  }

  function handlePresetClick(presetUrl) {
    setUrl(presetUrl)
    setValidationError('')
    onSubmit(presetUrl)
  }

  return (
    <div className="url-form-container">
      <form className="url-form" onSubmit={handleSubmit} noValidate>
        <div className="url-form__dock">
          <span className="url-form__search-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            id="audit-url"
            type="url"
            className="url-form__input"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={loading}
            aria-label="Website URL to audit"
            autoComplete="off"
            spellCheck="false"
          />

          <button
            type="submit"
            className="url-form__button"
            disabled={loading}
            id="analyze-button"
          >
            {loading ? (
              <>
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <span>Analyze Website</span>
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>

        {validationError && (
          <p className="url-form__error" role="alert">
            {validationError}
          </p>
        )}

        <div className="url-presets">
          <span>Try quick sample:</span>
          {SAMPLE_URLS.map((sample) => (
            <button
              key={sample}
              type="button"
              className="url-preset-btn"
              onClick={() => handlePresetClick(sample)}
              disabled={loading}
            >
              {sample.replace('https://', '')}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}

export default UrlForm
