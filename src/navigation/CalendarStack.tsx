import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarStackParamList } from './types';
import { CalendarViewScreen } from '@/screens/calendar/CalendarViewScreen';
import { AddEventScreen } from '@/screens/calendar/AddEventScreen';
import { EventDetailsScreen } from '@/screens/calendar/EventDetailsScreen';
import { EditEventScreen } from '@/screens/calendar/EditEventScreen';
import { theme } from '@/theme';

const Stack = createNativeStackNavigator<CalendarStackParamList>();

export const CalendarStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.semibold,
        },
      }}
    >
      <Stack.Screen
        name="CalendarView"
        component={CalendarViewScreen}
        options={{ title: 'Kalender' }}
      />
      <Stack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{ title: 'Termin hinzufügen' }}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{ title: 'Termindetails' }}
      />
      <Stack.Screen
        name="EditEvent"
        component={EditEventScreen}
        options={{ title: 'Termin bearbeiten' }}
      />
    </Stack.Navigator>
  );
};
