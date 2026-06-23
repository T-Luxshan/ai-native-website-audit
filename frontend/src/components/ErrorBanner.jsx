function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="error-banner" role="alert">
      <p className="error-banner__message">{message}</p>
      {onDismiss && (
        <button
          type="button"
          className="error-banner__dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default ErrorBanner
