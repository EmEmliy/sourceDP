import { Component } from 'react'
import { Link } from 'react-router-dom'
import { LanguageContext } from '../contexts/LanguageContext'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <LanguageContext.Consumer>
          {({ t }) => (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="text-6xl mb-4">😵</div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">{t.errorBoundary.title}</h1>
                <p className="text-gray-500 mb-6">
                  {t.errorBoundary.message}
                </p>
                {this.state.error && (
                  <p className="text-xs text-red-400 mb-4 font-mono bg-red-50 p-2 rounded">
                    {this.state.error.message}
                  </p>
                )}
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={this.handleRetry}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    {t.errorBoundary.retry}
                  </button>
                  <Link
                    to="/"
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    {t.errorBoundary.backHome}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </LanguageContext.Consumer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
