import { useState } from 'react'

function isValidUrl(value) {
  return value.startsWith('http://') || value.startsWith('https://')
}

function UrlForm({ onSubmit, loading }) {
  const [url, setUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = url.trim()

    if (!trimmed) {
      setValidationError('Please enter a URL.')
      return
    }

    if (!isValidUrl(trimmed)) {
      setValidationError('URL must start with http:// or https://')
      return
    }

    setValidationError('')
    onSubmit(trimmed)
  }

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <label className="url-form__label" htmlFor="audit-url">
        Website URL
      </label>
      <div className="url-form__row">
        <input
          id="audit-url"
          type="url"
          className="url-form__input"
          placeholder="https://example.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={loading}
        />
        <button type="submit" className="url-form__button" disabled={loading}>
          {loading ? 'Auditing…' : 'Run Audit'}
        </button>
      </div>
      {validationError && (
        <p className="url-form__error" role="alert">
          {validationError}
        </p>
      )}
    </form>
  )
}

export default UrlForm
