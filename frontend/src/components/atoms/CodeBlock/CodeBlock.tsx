import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface CodeBlockProps {
  /** Quellcode */
  code: string
  /** Sprache für Syntax-Highlighting */
  language: string
  /** Optionaler Dateiname in der Kopfzeile */
  filename?: string
  /** Dunkles Theme erzwingen (default: folgt prefers-color-scheme) */
  forceDark?: boolean
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * CodeBlock – Syntax-Highlighting via react-syntax-highlighter mit Copy-Button.
 * Theme folgt der Tailwind `dark:`-Klasse auf `<html>`.
 *
 * @example
 * <CodeBlock code={`const x = 1`} language="typescript" filename="example.ts" />
 */
export default function CodeBlock({ code, language, filename, forceDark, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const isDark = forceDark ?? document.documentElement.classList.contains('dark')

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <div className={cn('overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700', className)}>
      {/* Kopfzeile */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
        <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
          {filename ?? language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
          aria-label="Code kopieren"
        >
          {copied
            ? <><Check size={12} className="text-green-500" aria-hidden /> Kopiert</>
            : <><Copy size={12} aria-hidden /> Kopieren</>}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '0.8125rem' }}
        showLineNumbers
        wrapLongLines
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  )
}
