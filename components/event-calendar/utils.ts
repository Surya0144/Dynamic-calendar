import {
  addDays,
  addMonths,
  addWeeks,
  differenceInDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  getDate,
  isBefore,
  isSameDay,
  isWithinInterval,
  setDate,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import type {
  CalendarEvent,
  EventColor,
  RecurrencePattern,
} from "@/components/event-calendar"

/**
 * Get CSS classes for event colors
 */
export function getEventColorClasses(color?: EventColor | string): string {
  const eventColor = color || "sky"

  switch (eventColor) {
    case "sky":
      return "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8"
    case "amber":
      return "bg-amber-200/50 hover:bg-amber-200/40 text-amber-950/80 dark:bg-amber-400/25 dark:hover:bg-amber-400/20 dark:text-amber-200 shadow-amber-700/8"
    case "violet":
      return "bg-violet-200/50 hover:bg-violet-200/40 text-violet-950/80 dark:bg-violet-400/25 dark:hover:bg-violet-400/20 dark:text-violet-200 shadow-violet-700/8"
    case "rose":
      return "bg-rose-200/50 hover:bg-rose-200/40 text-rose-950/80 dark:bg-rose-400/25 dark:hover:bg-rose-400/20 dark:text-rose-200 shadow-rose-700/8"
    case "emerald":
      return "bg-emerald-200/50 hover:bg-emerald-200/40 text-emerald-950/80 dark:bg-emerald-400/25 dark:hover:bg-emerald-400/20 dark:text-emerald-200 shadow-emerald-700/8"
    case "orange":
      return "bg-orange-200/50 hover:bg-orange-200/40 text-orange-950/80 dark:bg-orange-400/25 dark:hover:bg-orange-400/20 dark:text-orange-200 shadow-orange-700/8"
    default:
      return "bg-sky-200/50 hover:bg-sky-200/40 text-sky-950/80 dark:bg-sky-400/25 dark:hover:bg-sky-400/20 dark:text-sky-200 shadow-sky-700/8"
  }
}

/**
 * Get CSS classes for border radius based on event position in multi-day events
 */
export function getBorderRadiusClasses(
  isFirstDay: boolean,
  isLastDay: boolean
): string {
  if (isFirstDay && isLastDay) {
    return "rounded" // Both ends rounded
  } else if (isFirstDay) {
    return "rounded-l rounded-r-none" // Only left end rounded
  } else if (isLastDay) {
    return "rounded-r rounded-l-none" // Only right end rounded
  } else {
    return "rounded-none" // No rounded corners
  }
}

/**
 * Check if an event is a multi-day event
 */
export function isMultiDayEvent(event: CalendarEvent): boolean {
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  return event.allDay || eventStart.getDate() !== eventEnd.getDate()
}

/**
 * Filter events for a specific day
 */
export function getEventsForDay(
  events: CalendarEvent[],
  day: Date
): CalendarEvent[] {
  return events
    .filter((event) => {
      const eventStart = new Date(event.start)
      return isSameDay(day, eventStart)
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
}

/**
 * Sort events with multi-day events first, then by start time
 */
export function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((a, b) => {
    const aIsMultiDay = isMultiDayEvent(a)
    const bIsMultiDay = isMultiDayEvent(b)

    if (aIsMultiDay && !bIsMultiDay) return -1
    if (!aIsMultiDay && bIsMultiDay) return 1

    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })
}

/**
 * Get multi-day events that span across a specific day (but don't start on that day)
 */
export function getSpanningEventsForDay(
  events: CalendarEvent[],
  day: Date
): CalendarEvent[] {
  return events.filter((event) => {
    if (!isMultiDayEvent(event)) return false

    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    // Only include if it's not the start day but is either the end day or a middle day
    return (
      !isSameDay(day, eventStart) &&
      (isSameDay(day, eventEnd) || (day > eventStart && day < eventEnd))
    )
  })
}

/**
 * Generate recurring event instances for a given date range
 */
export function generateRecurringEvents(
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  if (!event.recurrence) return [event]

  const { type, interval = 1, weekDays, monthDay, endDate } = event.recurrence
  const eventStart = new Date(event.start)
  const eventEnd = new Date(event.end)
  const eventDuration = differenceInDays(eventEnd, eventStart)
  const instances: CalendarEvent[] = []

  // Don't generate instances if the range is after the recurrence end date
  if (endDate && isBefore(endDate, rangeStart)) {
    return []
  }

  const generateInstance = (start: Date): CalendarEvent => {
    const end = addDays(start, eventDuration)
    return {
      ...event,
      id: `${event.id}-${start.getTime()}`,
      start,
      end,
      isRecurringInstance: true,
    }
  }

  switch (type) {
    case "daily":
      eachDayOfInterval({ start: rangeStart, end: rangeEnd }).forEach(
        (date) => {
          if (endDate && isBefore(endDate, date)) return
          instances.push(generateInstance(date))
        }
      )
      break

    case "weekly":
      if (!weekDays?.length) return [event]
      eachWeekOfInterval({ start: rangeStart, end: rangeEnd }).forEach(
        (weekStart) => {
          if (endDate && isBefore(endDate, weekStart)) return
          weekDays.forEach((day) => {
            const date = addDays(startOfWeek(weekStart), day)
            if (isWithinInterval(date, { start: rangeStart, end: rangeEnd })) {
              instances.push(generateInstance(date))
            }
          })
        }
      )
      break

    case "monthly":
      if (!monthDay) return [event]
      let currentMonth = startOfMonth(rangeStart)
      while (isBefore(currentMonth, rangeEnd)) {
        if (endDate && isBefore(endDate, currentMonth)) break
        const date = setDate(currentMonth, monthDay)
        if (
          isWithinInterval(date, { start: rangeStart, end: rangeEnd }) &&
          getDate(endOfMonth(currentMonth)) >= monthDay
        ) {
          instances.push(generateInstance(date))
        }
        currentMonth = addMonths(currentMonth, 1)
      }
      break

    case "custom":
      let currentDate = new Date(eventStart)
      while (isBefore(currentDate, rangeEnd)) {
        if (endDate && isBefore(endDate, currentDate)) break
        if (
          isWithinInterval(currentDate, { start: rangeStart, end: rangeEnd })
        ) {
          instances.push(generateInstance(currentDate))
        }
        currentDate = addWeeks(currentDate, interval)
      }
      break

    default:
      return [event]
  }

  return instances
}

/**
 * Get all events (including recurring instances) for a specific day
 */
export function getAllEventsForDay(
  events: CalendarEvent[],
  day: Date
): CalendarEvent[] {
  const start = startOfWeek(day)
  const end = endOfWeek(day)

  return events
    .flatMap((event) => generateRecurringEvents(event, start, end))
    .filter((event) => {
      const eventStart = new Date(event.start)
      const eventEnd = new Date(event.end)
      return (
        isSameDay(day, eventStart) ||
        isSameDay(day, eventEnd) ||
        (day > eventStart && day < eventEnd)
      )
    })
}

/**
 * Get all events (including recurring instances) for a day (for agenda view)
 */
export function getAgendaEventsForDay(
  events: CalendarEvent[],
  day: Date
): CalendarEvent[] {
  return getAllEventsForDay(events, day).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  )
}
