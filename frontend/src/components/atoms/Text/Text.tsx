import type { ElementType } from 'react'
import { cn } from '../../../lib/utils'

/** Semantisches HTML-Element */
export type TextAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'caption'

/** Typografie-Varianten */
export type TextVariant = 'heading' | 'subheading' | 'body' | 'label' | 'caption'

/** Schriftstärke */
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold'

export interface TextProps {
  /** HTML-Element das gerendert wird */
  as?: TextAs
  /** Visueller Stil */
  variant?: TextVariant
  /** Schriftstärke */
  weight?: TextWeight
  /** Zusätzliche CSS-Klassen */
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<TextVariant, string> = {
  heading:    'text-2xl leading-tight tracking-tight',
  subheading: 'text-lg leading-snug',
  body:       'text-base leading-relaxed',
  label:      'text-sm leading-none',
  caption:    'text-xs text-gray-500 leading-none',
}

const weightClasses: Record<TextWeight, string> = {
  normal:   'font-normal',
  medium:   'font-medium',
  semibold: 'font-semibold',
  bold:     'font-bold',
}

/**
 * Text – Typografie-Atom für alle Textelemente.
 *
 * @example
 * <Text as="h1" variant="heading" weight="bold">Titel</Text>
 * <Text variant="body">Fließtext-Inhalt hier.</Text>
 * <Text variant="caption">Bildunterschrift</Text>
 */
export default function Text({
  as: Tag = 'p',
  variant = 'body',
  weight = 'normal',
  className,
  children,
}: TextProps) {
  const Component = Tag as ElementType
  return (
    <Component
      className={cn(
        variantClasses[variant],
        weightClasses[weight],
        className,
      )}
    >
      {children}
    </Component>
  )
}
