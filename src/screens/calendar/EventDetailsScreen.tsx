import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Calendar,
  Clock,
  MapPin,
  Bell,
  Edit,
  Trash2,
  Tag,
} from 'lucide-react-native';
import { CalendarStackParamList } from '@/navigation/types';
import { Card, LoadingScreen, Button, Badge } from '@/components/common';
import { useEvent, useDeleteEvent } from '@/hooks/useCalendar';
import { theme } from '@/theme';
import { EventCategory } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

type Props = NativeStackScreenProps<CalendarStackParamList, 'EventDetails'>;

const CATEGORY_COLORS: Record<EventCategory, string> = {
  uni: theme.colors.primary,
  work: theme.colors.accent,
  personal: theme.colors.secondary,
  health: theme.colors.error,
  social: theme.colors.categories.entertainment,
  other: theme.colors.textSecondary,
};

const CATEGORY_LABELS: Record<EventCategory, string> = {
  uni: 'Universität',
  work: 'Arbeit',
  personal: 'Persönlich',
  health: 'Gesundheit',
  social: 'Sozial',
  other: 'Sonstiges',
};

const REMINDER_LABELS: Record<string, string> = {
  '5min': '5 Minuten vorher',
  '15min': '15 Minuten vorher',
  '30min': '30 Minuten vorher',
  '1hour': '1 Stunde vorher',
  '1day': '1 Tag vorher',
  none: 'Keine Erinnerung',
};

export const EventDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;
  const { data: event, isLoading } = useEvent(eventId);
  const deleteEventMutation = useDeleteEvent();

  const handleEdit = () => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleDelete = () => {
    Alert.alert(
      'Termin löschen',
      'Möchtest du diesen Termin wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            deleteEventMutation.mutate(eventId, {
              onSuccess: () => {
                Alert.alert('Erfolg', 'Termin wurde gelöscht');
                navigation.goBack();
              },
              onError: () => {
                Alert.alert('Fehler', 'Termin konnte nicht gelöscht werden');
              },
            });
          },
        },
      ]
    );
  };

  if (isLoading || !event) {
    return <LoadingScreen />;
  }

  const categoryColor = CATEGORY_COLORS[event.category];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <View
            style={[styles.categoryBar, { backgroundColor: categoryColor }]}
          />
          <View style={styles.headerContent}>
            <Text style={styles.title}>{event.title}</Text>
            <Badge
              label={CATEGORY_LABELS[event.category]}
              variant="primary"
              size="sm"
            />
          </View>
        </Card>

        {/* Description */}
        {event.description && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Beschreibung</Text>
            <Text style={styles.description}>{event.description}</Text>
          </Card>
        )}

        {/* Date & Time */}
        <Card style={styles.card}>
          <View style={styles.infoRow}>
            <Calendar color={theme.colors.primary} size={24} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Datum</Text>
              <Text style={styles.infoValue}>
                {format(new Date(event.startDate), 'EEEE, d. MMMM yyyy', {
                  locale: de,
                })}
              </Text>
            </View>
          </View>

          {!event.isAllDay && (
            <View style={styles.infoRow}>
              <Clock color={theme.colors.primary} size={24} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Uhrzeit</Text>
                <Text style={styles.infoValue}>
                  {format(new Date(event.startDate), 'HH:mm')} -{' '}
                  {format(new Date(event.endDate), 'HH:mm')}
                </Text>
              </View>
            </View>
          )}

          {event.isAllDay && (
            <View style={styles.infoRow}>
              <Clock color={theme.colors.primary} size={24} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Ganztägig</Text>
                <Text style={styles.infoValue}>Ganzer Tag</Text>
              </View>
            </View>
          )}
        </Card>

        {/* Location & Reminder */}
        {(event.location || event.reminder) && (
          <Card style={styles.card}>
            {event.location && (
              <View style={styles.infoRow}>
                <MapPin color={theme.colors.primary} size={24} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Ort</Text>
                  <Text style={styles.infoValue}>{event.location}</Text>
                </View>
              </View>
            )}

            {event.reminder && (
              <View style={[styles.infoRow, event.location && { marginTop: theme.spacing.md }]}>
                <Bell color={theme.colors.primary} size={24} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Erinnerung</Text>
                  <Text style={styles.infoValue}>
                    {REMINDER_LABELS[event.reminder] || event.reminder}
                  </Text>
                </View>
              </View>
            )}
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Bearbeiten"
            onPress={handleEdit}
            variant="primary"
            icon={<Edit color={theme.colors.textInverse} size={20} />}
            style={styles.actionButton}
          />
          <Button
            title="Löschen"
            onPress={handleDelete}
            variant="outline"
            icon={<Trash2 color={theme.colors.error} size={20} />}
            style={[styles.actionButton, styles.deleteButton]}
            loading={deleteEventMutation.isPending}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  headerCard: {
    marginBottom: theme.spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  categoryBar: {
    height: 6,
    width: '100%',
  },
  headerContent: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  card: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    flex: 1,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});
