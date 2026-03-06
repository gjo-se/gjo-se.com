import Avatar, { type AvatarSize } from '../../atoms/Avatar'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'

export interface AvatarWithNameProps {
  /** Bild-URL */
  src?: string
  /** Fallback-Initialen */
  initials?: string
  /** Name der Person (auch Alt-Text für Avatar) */
  name: string
  /** Optionale Rollenbezeichnung */
  role?: string
  /** Avatar-Größe */
  size?: AvatarSize
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * AvatarWithName – Avatar-Atom kombiniert mit Name und optionaler Rollenbezeichnung.
 *
 * @example
 * <AvatarWithName name="Gregory Erdmann" role="Senior Developer" initials="GE" size="md" />
 */
export default function AvatarWithName({
  src,
  initials,
  name,
  role,
  size = 'md',
  className,
}: AvatarWithNameProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar src={src} alt={name} initials={initials} size={size} />
      <div className="flex flex-col">
        <Text variant="label" weight="semibold" className="text-gray-900">
          {name}
        </Text>
        {role && (
          <Text variant="caption" className="text-gray-500">
            {role}
          </Text>
        )}
      </div>
    </div>
  )
}
