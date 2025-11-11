import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService } from '@/services/calendarService';
import { useCalendarStore } from '@/store/calendarStore';
import { CalendarEvent, EventFilter } from '@/types';

const QUERY_KEYS = {
  events: (userId: string, filter?: EventFilter) => ['events', userId, filter],
  event: (id: string) => ['event', id],
};

// Events
export const useEvents = (userId: string, filter?: EventFilter) => {
  const { setEvents } = useCalendarStore();

  return useQuery({
    queryKey: QUERY_KEYS.events(userId, filter),
    queryFn: async () => {
      const data = await calendarService.getEvents(userId, filter);
      setEvents(data);
      return data;
    },
    staleTime: 60000, // 1 minute
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.event(id),
    queryFn: () => calendarService.getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { addEvent } = useCalendarStore();

  return useMutation({
    mutationFn: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) =>
      calendarService.createEvent(event),
    onSuccess: (data) => {
      addEvent(data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { updateEvent } = useCalendarStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CalendarEvent> }) =>
      calendarService.updateEvent(id, updates),
    onSuccess: (data) => {
      updateEvent(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { deleteEvent } = useCalendarStore();

  return useMutation({
    mutationFn: (id: string) => calendarService.deleteEvent(id),
    onSuccess: (_, id) => {
      deleteEvent(id);
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
