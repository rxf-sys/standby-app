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
import { BudgetStackParamList } from '@/navigation/types';
import { Button, Input, LoadingScreen } from '@/components/common';
import { useTransaction, useUpdateTransaction } from '@/hooks/useBudget';
import { theme } from '@/theme';
import { ExpenseCategory, IncomeSource } from '@/types';
import { format } from 'date-fns';

type Props = NativeStackScreenProps<BudgetStackParamList, 'EditTransaction'>;

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

export const EditTransactionScreen: React.FC<Props> = ({ navigation, route }) => {
  const { transactionId } = route.params;
  const { data: transaction, isLoading } = useTransaction(transactionId);
  const updateTransactionMutation = useUpdateTransaction();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory | IncomeSource>('food');

  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || '');
      setCategory(transaction.category as ExpenseCategory | IncomeSource);
    }
  }, [transaction]);

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Fehler', 'Bitte gib einen gültigen Betrag ein');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Fehler', 'Bitte gib eine Beschreibung ein');
      return;
    }

    if (!transaction) return;

    updateTransactionMutation.mutate(
      {
        id: transactionId,
        updates: {
          amount: parseFloat(amount),
          description: description.trim(),
          category,
        },
      },
      {
        onSuccess: () => {
          Alert.alert('Erfolg', 'Transaktion wurde aktualisiert', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: () => {
          Alert.alert('Fehler', 'Transaktion konnte nicht aktualisiert werden');
        },
      }
    );
  };

  if (isLoading || !transaction) {
    return <LoadingScreen />;
  }

  const categories = transaction.type === 'income' ? INCOME_SOURCES : EXPENSE_CATEGORIES;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label="Betrag (€) *"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />

        <Input
          label="Beschreibung *"
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

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Typ</Text>
          <Text style={styles.infoValue}>
            {transaction.type === 'income' ? 'Einnahme' : 'Ausgabe'}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Datum</Text>
          <Text style={styles.infoValue}>
            {format(new Date(transaction.date), 'dd.MM.yyyy HH:mm')}
          </Text>
        </View>

        <Button
          title="Änderungen speichern"
          onPress={handleSubmit}
          loading={updateTransactionMutation.isPending}
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
  infoBox: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
