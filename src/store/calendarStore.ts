import { create } from 'zustand';
import { CalendarEvent } from '@/types';

interface CalendarState {
  events: CalendarEvent[];
  selectedDate: string;
  setEvents: (events: CalendarEvent[]) => void;
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  setSelectedDate: (date: string) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  selectedDate: new Date().toISOString().split('T')[0],

  setEvents: (events) => set({ events }),

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  updateEvent: (id, updates) =>
    set((state) => ({
      events: state.events.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),

  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
