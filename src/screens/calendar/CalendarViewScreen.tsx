import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { CalendarStackParamList } from '@/navigation/types';
import { Card, LoadingScreen } from '@/components/common';
import { useCalendarStore } from '@/store/calendarStore';
import { calendarService } from '@/services/calendarService';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/theme';
import { CalendarEvent, EventCategory } from '@/types';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  getDay,
} from 'date-fns';
import { de } from 'date-fns/locale';

type Props = NativeStackScreenProps<CalendarStackParamList, 'CalendarView'>;

const CATEGORY_COLORS: Record<EventCategory, string> = {
  uni: theme.colors.primary,
  work: theme.colors.accent,
  personal: theme.colors.secondary,
  health: theme.colors.error,
  social: theme.colors.categories.entertainment,
  other: theme.colors.textSecondary,
};

export const CalendarViewScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const { events, selectedDate, setEvents, setSelectedDate } = useCalendarStore();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      const data = await calendarService.getEvents(user.id);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      // Set mock data
      setMockEvents();
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [user]);

  const setMockEvents = () => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        userId: user?.id || 'mock-user-id',
        title: 'Mathematik Vorlesung',
        description: 'Lineare Algebra',
        category: 'uni',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        location: 'Hörsaal A',
        reminder: '15min',
        isAllDay: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: 'mock-user-id',
        title: 'Zahnarzttermin',
        category: 'health',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        reminder: '1hour',
        isAllDay: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setEvents(mockEvents);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.startDate), date)
    );
  };

  const getDaysInMonth = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  };

  const selectedDateEvents = events.filter((event) =>
    isSameDay(new Date(event.startDate), new Date(selectedDate))
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Month Header with Navigation */}
        <Card style={styles.monthCard}>
          <View style={styles.monthHeader}>
            <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthNavButton}>
              <ChevronLeft color={theme.colors.primary} size={28} />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavButton}>
              <ChevronRight color={theme.colors.primary} size={28} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Calendar Grid */}
        <Card style={styles.calendarCard}>
          <View style={styles.weekDays}>
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.daysGrid}>
            {getDaysInMonth().map((day) => {
              const dayEvents = getEventsForDate(day);
              const isSelected = isSameDay(day, new Date(selectedDate));
              const isTodayDate = isToday(day);

              return (
                <TouchableOpacity
                  key={day.toISOString()}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    isTodayDate && styles.dayCellToday,
                  ]}
                  onPress={() => setSelectedDate(day.toISOString())}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      isTodayDate && styles.dayTextToday,
                    ]}
                  >
                    {format(day, 'd')}
                  </Text>
                  {dayEvents.length > 0 && (
                    <View style={styles.eventDots}>
                      {dayEvents.slice(0, 3).map((event, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.eventDot,
                            { backgroundColor: CATEGORY_COLORS[event.category] },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Events for Selected Date */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsSectionHeader}>
            <Text style={styles.sectionTitle}>
              Termine am {format(new Date(selectedDate), 'd. MMMM', { locale: de })}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddEvent', { date: selectedDate })}
            >
              <Plus color={theme.colors.primary} size={24} />
            </TouchableOpacity>
          </View>

          {selectedDateEvents.length === 0 ? (
            <Card>
              <Text style={styles.emptyText}>Keine Termine an diesem Tag</Text>
            </Card>
          ) : (
            selectedDateEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event.id)}
                activeOpacity={0.7}
              >
                <Card style={styles.eventCard}>
                  <View
                    style={[
                      styles.eventColorBar,
                      { backgroundColor: CATEGORY_COLORS[event.category] },
                    ]}
                  />
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {event.description && (
                      <Text style={styles.eventDescription}>{event.description}</Text>
                    )}
                    <View style={styles.eventMeta}>
                      <CalendarIcon color={theme.colors.textSecondary} size={14} />
                      <Text style={styles.eventTime}>
                        {event.isAllDay
                          ? 'Ganztägig'
                          : `${format(new Date(event.startDate), 'HH:mm')} - ${format(new Date(event.endDate), 'HH:mm')}`}
                      </Text>
                    </View>
                    {event.location && (
                      <Text style={styles.eventLocation}>📍 {event.location}</Text>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEvent', {})}
      >
        <Plus color={theme.colors.textInverse} size={28} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  monthCard: {
    marginBottom: theme.spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthNavButton: {
    padding: theme.spacing.xs,
  },
  monthText: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  calendarCard: {
    marginBottom: theme.spacing.md,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
  dayCellSelected: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  dayText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  dayTextSelected: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.bold,
  },
  dayTextToday: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  eventDots: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  eventsSection: {
    marginBottom: theme.spacing.xl,
  },
  eventsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  eventCard: {
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    padding: 0,
    overflow: 'hidden',
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
  eventTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  eventDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  eventTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  eventLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.lg,
  },
});
