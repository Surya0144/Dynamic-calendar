# Event Calendar React Component

Dynamic Calendar is a modern, customizable React component designed to simplify event scheduling and management in web applications. Built with TypeScript and leveraging [v0](https://v0.dev/) UI components, this calendar offers a clean user experience with support for multiple views (Month, Week, Day, Agenda), drag-and-drop event management, event color coding, and responsive design.

👉 [Try the Live Demo](https://my-dynamic-calendar.netlify.app/) | [View Source](https://github.com/Surya0144/dynamic-calendar)


## Features

- 📅 Multiple view modes: Month, Week, Day, and Agenda
- 🔄 Drag-and-drop event management
- 🎨 Event color customization
- 📱 Responsive design for all screen sizes
- 🌓 Dark mode support
- 🗓️ All-day events support
- 📍 Location support for events
- 🔄 Easy navigation between time periods
- ↻ Recurring events with multiple patterns:
  - Daily recurrence
  - Weekly recurrence (with specific day selection)
  - Monthly recurrence (on specific day of month)
  - Custom recurrence (with week intervals)
  - Optional end date for recurrence patterns

## Usage

```jsx
import { EventCalendar, type CalendarEvent } from "@/components/event-calendar";

function App() {
  const [events, setEvents] = useState([]);

  const handleEventAdd = (event) => {
    setEvents([...events, event]);
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const handleEventDelete = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <EventCalendar
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="month"
    />
  );
}
```

## Props

| Prop            | Type                                     | Default   | Description                                |
| --------------- | ---------------------------------------- | --------- | ------------------------------------------ |
| `events`        | `CalendarEvent[]`                        | `[]`      | Array of events to display in the calendar |
| `onEventAdd`    | `(event: CalendarEvent) => void`         | -         | Callback function when an event is added   |
| `onEventUpdate` | `(event: CalendarEvent) => void`         | -         | Callback function when an event is updated |
| `onEventDelete` | `(eventId: string) => void`              | -         | Callback function when an event is deleted |
| `className`     | `string`                                 | -         | Additional CSS class for styling           |
| `initialView`   | `"month" \| "week" \| "day" \| "agenda"` | `"month"` | Initial view mode of the calendar          |

## Event Object Structure

```typescript
interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: "sky" | "amber" | "violet" | "rose" | "emerald" | "orange"
  location?: string
  recurrence?: RecurrencePattern
  isRecurringInstance?: boolean
}

interface RecurrencePattern {
  type: "none" | "daily" | "weekly" | "monthly" | "custom"
  interval?: number // For custom recurrence (e.g., every 2 weeks)
  weekDays?: number[] // For weekly recurrence (0-6, where 0 is Sunday)
  monthDay?: number // For monthly recurrence (1-31)
  endDate?: Date // Optional end date for the recurrence
}
```

## View Modes

### Month View

- Traditional month calendar layout
- Events span across multiple days
- Recurring events shown with indicators
- Color-coded events for easy recognition

### Week View

- Detailed hourly schedule
- Multi-day events at the top
- Overlapping event support
- Real-time drag-and-drop

### Day View

- Focused single-day schedule
- Detailed event information
- Easy event creation
- Time-slot selection

### Agenda View

- List-style event display
- Chronological ordering
- Full event details
- Quick event scanning

## Recurring Events

The calendar supports various recurrence patterns:

### Daily Recurrence

- Events repeat every day until the optional end date

### Weekly Recurrence

- Select specific days of the week for the event to repeat
- Events repeat on the selected days every week

### Monthly Recurrence

- Select a specific day of the month (1-31)
- Events repeat on that day every month

### Custom Recurrence

- Set a custom interval in weeks
- Events repeat after the specified number of weeks

All recurrence patterns support:

- Optional end date
- Visual indication with a repeat icon
- Proper handling across all view modes

## Limitations and Known Issues

This calendar component is in early alpha stage and is not recommended for production use. There are several limitations and issues that need to be addressed:

### Drag and Drop Limitations

- In month view, only the first day of multi-day events is draggable
- In week and day views, multi-day events are placed in an "All day" section at the top of the view and are not draggable
- Some drag and drop operations may not update the event data correctly in certain edge cases

### Visual and UX Issues

- Limited responsiveness on very small screens
- Event overlapping is not handled optimally in some views
- Limited keyboard navigation support
- Accessibility features are incomplete

### Technical Limitations

- Recurring events with very high frequency might impact performance
- Time zone handling for recurring events needs improvement
- No support for complex recurrence rules (e.g., "last Thursday of the month")

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
