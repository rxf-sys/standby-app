import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { BudgetStackParamList } from '@/navigation/types';
import { SavingsGoalCard } from '@/components/budget';
import { EmptyState, LoadingScreen } from '@/components/common';
import { useSavingsGoals } from '@/hooks/useBudget';
import { theme } from '@/theme';
import { Target } from 'lucide-react-native';

type Props = NativeStackScreenProps<BudgetStackParamList, 'SavingsGoals'>;

export const SavingsGoalsScreen: React.FC<Props> = ({ navigation }) => {
  const userId = 'mock-user-id'; // Replace with actual user ID
  const { data: goals, isLoading } = useSavingsGoals(userId);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!goals || goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Keine Sparziele"
            message="Erstelle dein erstes Sparziel und erreiche deine finanziellen Träume!"
            actionLabel="Sparziel erstellen"
            onAction={() => navigation.navigate('AddSavingsGoal')}
          />
        ) : (
          <>
            <Text style={styles.subtitle}>
              Du hast {goals.length} aktive{goals.length === 1 ? 's' : ''} Sparziel
              {goals.length === 1 ? '' : 'e'}
            </Text>
            {goals.map((goal) => (
              <SavingsGoalCard
                key={goal.id}
                goal={goal}
                onPress={() => {
                  // Navigate to goal details
                }}
              />
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {goals && goals.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddSavingsGoal')}
        >
          <Plus color={theme.colors.textInverse} size={28} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
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
