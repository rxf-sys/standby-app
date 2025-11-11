import { supabase } from './supabase';
import { CalendarEvent, EventFilter } from '@/types';

export const calendarService = {
  async getEvents(userId: string, filter?: EventFilter) {
    let query = supabase
      .from('calendar_events')
      .select('*')
      .eq('userId', userId);

    if (filter?.categories?.length) {
      query = query.in('category', filter.categories);
    }

    if (filter?.startDate) {
      query = query.gte('startDate', filter.startDate);
    }

    if (filter?.endDate) {
      query = query.lte('endDate', filter.endDate);
    }

    query = query.order('startDate', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data as CalendarEvent[];
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as CalendarEvent;
  },

  async createEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data as CalendarEvent;
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as CalendarEvent;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
