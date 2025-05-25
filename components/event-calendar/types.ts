export type CalendarView = "month" | "week" | "day" | "agenda"

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom"

export interface RecurrencePattern {
  type: RecurrenceType
  interval?: number // For custom recurrence (e.g., every 2 weeks)
  weekDays?: number[] // For weekly recurrence (0-6, where 0 is Sunday)
  monthDay?: number // For monthly recurrence (1-31)
  endDate?: Date // Optional end date for the recurrence
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: EventColor
  location?: string
  recurrence?: RecurrencePattern
  isRecurringInstance?: boolean // Flag to identify generated recurring instances
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange"
