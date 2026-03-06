import type { LucideIcon } from 'lucide-react'
import Badge from '../../atoms/Badge'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'

/** Skill-Level */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface SkillCardProps {
  /** Name der Technologie/Skill */
  name: string
  /** Optionales Icon */
  icon?: LucideIcon
  /** Kompetenzniveau */
  level?: SkillLevel
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const levelConfig: Record<SkillLevel, { label: string; variant: 'default' | 'info' | 'success' | 'warning' }> = {
  beginner:     { label: 'Einsteiger',    variant: 'default' },
  intermediate: { label: 'Fortgeschritten', variant: 'info' },
  advanced:     { label: 'Erfahren',      variant: 'warning' },
  expert:       { label: 'Experte',       variant: 'success' },
}

/**
 * SkillCard – Karte zur Darstellung einer Technologie/eines Skills.
 *
 * @example
 * <SkillCard name="React" level="expert" icon={Code} />
 */
export default function SkillCard({ name, icon: IconComponent, level, className }: SkillCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm',
        className,
      )}
    >
      {IconComponent && (
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-50">
          <IconComponent size={20} className="text-gray-600" aria-hidden />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <Text variant="label" weight="medium" className="text-gray-900">
          {name}
        </Text>
        {level && (
          <Badge variant={levelConfig[level].variant} size="sm">
            {levelConfig[level].label}
          </Badge>
        )}
      </div>
    </div>
  )
}
