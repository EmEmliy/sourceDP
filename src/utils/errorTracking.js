const isDev = import.meta.env.DEV

export function logError(error, context = {}) {
  const errorInfo = {
    message: error?.message || String(error),
    stack: error?.stack,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    ...context
  }
  
  if (isDev) {
    console.error('🚨 Error:', errorInfo)
  } else {
    console.error('🚨 Error:', errorInfo)
  }
}

export function logWarning(message, context = {}) {
  const warningInfo = {
    message,
    timestamp: new Date().toISOString(),
    ...context
  }
  
  if (isDev) {
    console.warn('⚠️ Warning:', warningInfo)
  }
}

export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return
  
  window.onerror = (message, source, lineno, colno, error) => {
    logError(error, { type: 'global', lineno, colno, source })
    return false
  }
  
  window.onunhandledrejection = (event) => {
    logError(event.reason, { type: 'unhandledRejection' })
  }
}

export function trackPageView(pageName) {
  if (isDev) {
    console.log('📊 Page View:', pageName)
  }
}

export function trackEvent(eventName, properties = {}) {
  if (isDev) {
    console.log('📊 Event:', eventName, properties)
  }
}

export default {
  logError,
  logWarning,
  setupGlobalErrorHandler,
  trackPageView,
  trackEvent
}
