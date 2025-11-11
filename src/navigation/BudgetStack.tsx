import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetStackParamList } from './types';
import { BudgetOverviewScreen } from '@/screens/budget/BudgetOverviewScreen';
import { AddTransactionScreen } from '@/screens/budget/AddTransactionScreen';
import { theme } from '@/theme';

const Stack = createNativeStackNavigator<BudgetStackParamList>();

export const BudgetStack: React.FC = () => {
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
        name="BudgetOverview"
        component={BudgetOverviewScreen}
        options={{ title: 'Budget' }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={({ route }) => ({
          title: route.params.type === 'income' ? 'Einnahme hinzufügen' : 'Ausgabe hinzufügen',
        })}
      />
    </Stack.Navigator>
  );
};
