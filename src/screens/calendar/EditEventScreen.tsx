import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalendarStackParamList } from '@/navigation/types';
import { Button, Input, LoadingScreen } from '@/components/common';
import { useEvent, useUpdateEvent } from '@/hooks/useCalendar';
import { theme } from '@/theme';
import { EventCategory, ReminderType } from '@/types';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<CalendarStackParamList, 'EditEvent'>;

const CATEGORIES: Array<{ value: EventCategory; label: string }> = [
  { value: 'uni', label: 'Uni' },
  { value: 'work', label: 'Arbeit' },
  { value: 'personal', label: 'Privat' },
  { value: 'health', label: 'Gesundheit' },
  { value: 'social', label: 'Sozial' },
  { value: 'other', label: 'Sonstiges' },
];

const REMINDERS: Array<{ value: ReminderType; label: string }> = [
  { value: 'none', label: 'Keine' },
  { value: '5min', label: '5 Minuten vorher' },
  { value: '15min', label: '15 Minuten vorher' },
  { value: '30min', label: '30 Minuten vorher' },
  { value: '1hour', label: '1 Stunde vorher' },
  { value: '1day', label: '1 Tag vorher' },
];

export const EditEventScreen: React.FC<Props> = ({ navigation, route }) => {
  const { eventId } = route.params;
  const { data: event, isLoading } = useEvent(eventId);
  const updateEventMutation = useUpdateEvent();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('personal');
  const [reminder, setReminder] = useState<ReminderType>('15min');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setLocation(event.location || '');
      setCategory(event.category);
      setReminder(event.reminder || 'none');

      if (!event.isAllDay) {
        setStartTime(format(new Date(event.startDate), 'HH:mm'));
        setEndTime(format(new Date(event.endDate), 'HH:mm'));
      }
    }
  }, [event]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein');
      return;
    }

    if (!event) return;

    const eventDate = new Date(event.startDate);
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startDate = new Date(eventDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(eventDate);
    endDate.setHours(endHour, endMin, 0, 0);

    updateEventMutation.mutate(
      {
        id: eventId,
        updates: {
          title: title.trim(),
          description: description.trim() || undefined,
          location: location.trim() || undefined,
          category,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reminder,
          isAllDay: event.isAllDay,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Erfolg', 'Termin wurde aktualisiert', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: () => {
          Alert.alert('Fehler', 'Termin konnte nicht aktualisiert werden');
        },
      }
    );
  };

  if (isLoading || !event) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label="Titel *"
          value={title}
          onChangeText={setTitle}
          placeholder="z.B. Vorlesung Mathematik"
        />

        <Input
          label="Beschreibung"
          value={description}
          onChangeText={setDescription}
          placeholder="Weitere Details..."
          multiline
          numberOfLines={3}
        />

        <Input
          label="Ort"
          value={location}
          onChangeText={setLocation}
          placeholder="z.B. Hörsaal A"
        />

        {!event.isAllDay && (
          <View style={styles.timeContainer}>
            <View style={styles.timeInput}>
              <Input
                label="Startzeit"
                value={startTime}
                onChangeText={setStartTime}
                placeholder="09:00"
              />
            </View>
            <View style={styles.timeInput}>
              <Input
                label="Endzeit"
                value={endTime}
                onChangeText={setEndTime}
                placeholder="10:00"
              />
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Kategorie</Text>
          <View style={styles.optionsGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.optionButton,
                  category === cat.value && styles.optionButtonActive,
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    category === cat.value && styles.optionButtonTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Erinnerung</Text>
          <View style={styles.optionsGrid}>
            {REMINDERS.map((rem) => (
              <TouchableOpacity
                key={rem.value}
                style={[
                  styles.optionButton,
                  reminder === rem.value && styles.optionButtonActive,
                ]}
                onPress={() => setReminder(rem.value)}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    reminder === rem.value && styles.optionButtonTextActive,
                  ]}
                >
                  {rem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Änderungen speichern"
          onPress={handleSubmit}
          loading={updateEventMutation.isPending}
          fullWidth
          style={styles.submitButton}
        />
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
  timeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  timeInput: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  optionButtonTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
