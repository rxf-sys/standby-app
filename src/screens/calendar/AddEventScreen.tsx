import React, { useState } from 'react';
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
import { Button, Input } from '@/components/common';
import { useCalendarStore } from '@/store/calendarStore';
import { calendarService } from '@/services/calendarService';
import { theme } from '@/theme';
import { EventCategory, ReminderType } from '@/types';

type Props = NativeStackScreenProps<CalendarStackParamList, 'AddEvent'>;

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

export const AddEventScreen: React.FC<Props> = ({ navigation, route }) => {
  const { date } = route.params;
  const { addEvent } = useCalendarStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<EventCategory>('personal');
  const [reminder, setReminder] = useState<ReminderType>('15min');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Titel ein');
      return;
    }

    setLoading(true);
    try {
      const eventDate = date ? new Date(date) : new Date();
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      const startDate = new Date(eventDate);
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(eventDate);
      endDate.setHours(endHour, endMin, 0, 0);

      const event = await calendarService.createEvent({
        userId: 'mock-user-id',
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        category,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reminder,
        isAllDay: false,
      });

      addEvent(event);
      Alert.alert('Erfolg', 'Termin wurde hinzugefügt', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Fehler', 'Termin konnte nicht gespeichert werden');
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

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
          title="Termin erstellen"
          onPress={handleSubmit}
          loading={loading}
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
