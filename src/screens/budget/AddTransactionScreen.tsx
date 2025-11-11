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
import { BudgetStackParamList } from '@/navigation/types';
import { Button, Input } from '@/components/common';
import { useBudgetStore } from '@/store/budgetStore';
import { budgetService } from '@/services/budgetService';
import { theme } from '@/theme';
import { ExpenseCategory, IncomeSource } from '@/types';

type Props = NativeStackScreenProps<BudgetStackParamList, 'AddTransaction'>;

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food',
  'transport',
  'housing',
  'entertainment',
  'health',
  'education',
  'shopping',
  'other',
];

const INCOME_SOURCES: IncomeSource[] = [
  'salary',
  'freelance',
  'allowance',
  'investment',
  'other',
];

const CATEGORY_LABELS: Record<ExpenseCategory | IncomeSource, string> = {
  food: 'Essen & Trinken',
  transport: 'Transport',
  housing: 'Wohnen',
  entertainment: 'Unterhaltung',
  health: 'Gesundheit',
  education: 'Bildung',
  shopping: 'Shopping',
  other: 'Sonstiges',
  salary: 'Gehalt',
  freelance: 'Freiberuflich',
  allowance: 'Taschengeld',
  investment: 'Investition',
};

export const AddTransactionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { type } = route.params;
  const { addTransaction } = useBudgetStore();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | IncomeSource>(
    type === 'income' ? 'salary' : 'food'
  );
  const [loading, setLoading] = useState(false);

  const categories = type === 'income' ? INCOME_SOURCES : EXPENSE_CATEGORIES;

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Fehler', 'Bitte gib einen gültigen Betrag ein');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Fehler', 'Bitte gib eine Beschreibung ein');
      return;
    }

    setLoading(true);
    try {
      const transaction = await budgetService.createTransaction({
        userId: 'mock-user-id', // In production, get from auth
        type,
        amount: parseFloat(amount),
        category,
        description: description.trim(),
        date: new Date().toISOString(),
      });

      addTransaction(transaction);
      Alert.alert(
        'Erfolg',
        `${type === 'income' ? 'Einnahme' : 'Ausgabe'} wurde hinzugefügt`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Transaktion konnte nicht gespeichert werden');
      console.error('Error creating transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label="Betrag (€)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />

        <Input
          label="Beschreibung"
          value={description}
          onChangeText={setDescription}
          placeholder="z.B. Einkauf im Supermarkt"
        />

        <View style={styles.categorySection}>
          <Text style={styles.label}>Kategorie</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.categoryButtonTextActive,
                  ]}
                >
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={type === 'income' ? 'Einnahme hinzufügen' : 'Ausgabe hinzufügen'}
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
  categorySection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  categoryButtonTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
  },
});
