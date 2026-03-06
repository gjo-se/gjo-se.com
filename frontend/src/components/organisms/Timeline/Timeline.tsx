import TimelineItem, { type TimelineItemProps } from '../../molecules/TimelineItem'

export interface TimelineProps {
  items: TimelineItemProps[]
  className?: string
}

/** Timeline – Geordnete Liste aus TimelineItems (CV, Verlauf). Stub – wird in Phase 2c ausgebaut. */
export default function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <TimelineItem key={i} {...item} isLast={i === items.length - 1} />
      ))}
    </div>
  )
}
