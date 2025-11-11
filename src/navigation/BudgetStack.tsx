import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetStackParamList } from './types';
import { BudgetOverviewScreen } from '@/screens/budget/BudgetOverviewScreen';
import { AddTransactionScreen } from '@/screens/budget/AddTransactionScreen';
import { TransactionDetailsScreen } from '@/screens/budget/TransactionDetailsScreen';
import { EditTransactionScreen } from '@/screens/budget/EditTransactionScreen';
import { SavingsGoalsScreen } from '@/screens/budget/SavingsGoalsScreen';
import { AddSavingsGoalScreen } from '@/screens/budget/AddSavingsGoalScreen';
import { BudgetStatisticsScreen } from '@/screens/budget/BudgetStatisticsScreen';
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
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
        options={{ title: 'Transaktionsdetails' }}
      />
      <Stack.Screen
        name="EditTransaction"
        component={EditTransactionScreen}
        options={{ title: 'Transaktion bearbeiten' }}
      />
      <Stack.Screen
        name="SavingsGoals"
        component={SavingsGoalsScreen}
        options={{ title: 'Sparziele' }}
      />
      <Stack.Screen
        name="AddSavingsGoal"
        component={AddSavingsGoalScreen}
        options={{ title: 'Neues Sparziel' }}
      />
      <Stack.Screen
        name="BudgetStatistics"
        component={BudgetStatisticsScreen}
        options={{ title: 'Statistiken' }}
      />
    </Stack.Navigator>
  );
};
