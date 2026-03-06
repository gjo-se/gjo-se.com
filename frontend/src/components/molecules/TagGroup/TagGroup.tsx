import Tag, { type TagColor } from '../../atoms/Tag'
import { cn } from '../../../lib/utils'

export interface TagGroupProps {
  /** Liste der Tags */
  tags: string[]
  /** Einheitliche Farbe für alle Tags */
  color?: TagColor
  /** Callback beim Entfernen eines Tags */
  onRemove?: (tag: string) => void
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * TagGroup – Mehrere Tag-Atoms nebeneinander als Gruppe.
 *
 * @example
 * <TagGroup tags={['React', 'TypeScript', 'Python']} color="blue" />
 * <TagGroup tags={skills} onRemove={(t) => removeSkill(t)} />
 */
export default function TagGroup({ tags, color, onRemove, className }: TagGroupProps) {
  if (tags.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          color={color}
          onRemove={onRemove ? () => onRemove(tag) : undefined}
        />
      ))}
    </div>
  )
}
