import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BudgetStackParamList } from '@/navigation/types';
import { Button, Input } from '@/components/common';
import { useCreateSavingsGoal } from '@/hooks/useBudget';
import { theme } from '@/theme';

type Props = NativeStackScreenProps<BudgetStackParamList, 'AddSavingsGoal'>;

export const AddSavingsGoalScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [loading, setLoading] = useState(false);

  const createGoal = useCreateSavingsGoal();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Namen für dein Sparziel ein');
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Fehler', 'Bitte gib einen gültigen Zielbetrag ein');
      return;
    }

    if (!targetDate) {
      Alert.alert('Fehler', 'Bitte wähle ein Zieldatum');
      return;
    }

    setLoading(true);
    try {
      await createGoal.mutateAsync({
        userId: 'mock-user-id', // Replace with actual user ID
        name: name.trim(),
        targetAmount: amount,
        currentAmount: 0,
        targetDate: new Date(targetDate).toISOString(),
      });

      Alert.alert('Erfolg', 'Sparziel wurde erstellt', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Fehler', 'Sparziel konnte nicht erstellt werden');
      console.error('Error creating savings goal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Setze dir ein Sparziel und verfolge deinen Fortschritt!
        </Text>

        <Input
          label="Name des Sparziels *"
          value={name}
          onChangeText={setName}
          placeholder="z.B. Urlaub, Laptop, Notfallfonds"
        />

        <Input
          label="Zielbetrag (€) *"
          value={targetAmount}
          onChangeText={setTargetAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />

        <Input
          label="Zieldatum *"
          value={targetDate}
          onChangeText={setTargetDate}
          placeholder="YYYY-MM-DD"
        />

        <Button
          title="Sparziel erstellen"
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
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
  },
});
