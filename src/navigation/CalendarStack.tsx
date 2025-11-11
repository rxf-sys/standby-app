import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CalendarStackParamList } from './types';
import { CalendarViewScreen } from '@/screens/calendar/CalendarViewScreen';
import { AddEventScreen } from '@/screens/calendar/AddEventScreen';
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
    </Stack.Navigator>
  );
};
