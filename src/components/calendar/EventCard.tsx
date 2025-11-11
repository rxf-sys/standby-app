import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Clock } from 'lucide-react-native';
import { CalendarEvent, EventCategory } from '@/types';
import { theme } from '@/theme';
import { formatDate, formatTime } from '@/utils';

interface EventCardProps {
  event: CalendarEvent;
  onPress?: () => void;
}

const CATEGORY_COLORS: Record<EventCategory, string> = {
  uni: theme.colors.primary,
  work: theme.colors.accent,
  personal: theme.colors.secondary,
  health: theme.colors.error,
  social: theme.colors.categories.entertainment,
  other: theme.colors.textSecondary,
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  uni: 'Uni',
  work: 'Arbeit',
  personal: 'Privat',
  health: 'Gesundheit',
  social: 'Sozial',
  other: 'Sonstiges',
};

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const categoryColor = CATEGORY_COLORS[event.category];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.colorBar, { backgroundColor: categoryColor }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {event.title}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
            <Text style={[styles.categoryText, { color: categoryColor }]}>
              {CATEGORY_LABELS[event.category]}
            </Text>
          </View>
        </View>

        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Clock color={theme.colors.textSecondary} size={14} />
            <Text style={styles.infoText}>
              {event.isAllDay
                ? 'Ganztägig'
                : `${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
            </Text>
          </View>

          {event.location && (
            <View style={styles.infoRow}>
              <MapPin color={theme.colors.textSecondary} size={14} />
              <Text style={styles.infoText} numberOfLines={1}>
                {event.location}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  colorBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  footer: {
    gap: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
