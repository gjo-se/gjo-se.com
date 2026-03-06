import { Component, type ReactNode } from 'react'
import Button from '../../atoms/Button'
import Text from '../../atoms/Text'

export interface ErrorBoundaryProps {
  fallback?: ReactNode
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary – React Class Component zum Abfangen von Render-Fehlern.
 *
 * @example
 * <ErrorBoundary fallback={<p>Etwas ist schiefgelaufen.</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  handleReset = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <Text as="h2" variant="subheading" weight="semibold" className="text-red-700">
            Etwas ist schiefgelaufen
          </Text>
          <Text variant="body" className="text-sm text-red-600">
            {this.state.error?.message ?? 'Unbekannter Fehler'}
          </Text>
          <Button variant="secondary" size="sm" onClick={this.handleReset}>
            Erneut versuchen
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
