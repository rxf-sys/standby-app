export type EventCategory = 'uni' | 'work' | 'personal' | 'health' | 'social' | 'other'

export type ReminderType = 'none' | '5min' | '15min' | '30min' | '1hour' | '1day'

export interface CalendarEvent {
  id: string
  userId: string
  title: string
  description?: string
  category: EventCategory
  startDate: string
  endDate: string
  location?: string
  reminder: ReminderType
  isAllDay: boolean
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
    endDate?: string
  }
  createdAt: string
  updatedAt: string
}

export interface EventFilter {
  categories?: EventCategory[]
  startDate?: string
  endDate?: string
}
