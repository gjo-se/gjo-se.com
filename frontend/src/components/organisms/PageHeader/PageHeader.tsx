import type { BreadcrumbItem } from '../../molecules/Breadcrumb'
import Breadcrumb from '../../molecules/Breadcrumb'
import Text from '../../atoms/Text'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  className?: string
}

/** PageHeader – Seitentitel mit optionalem Untertitel und Breadcrumb. Stub – wird in Phase 2c ausgebaut. */
export default function PageHeader({ title, subtitle, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className ?? ''}`}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-3" />}
      <Text as="h1" variant="heading" weight="bold" className="text-gray-900">{title}</Text>
      {subtitle && <Text variant="body" className="mt-2 text-gray-500">{subtitle}</Text>}
    </div>
  )
}
