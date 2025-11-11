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
import { RecipesStackParamList } from '@/navigation/types';
import { Button, Input } from '@/components/common';
import { useAddToShoppingList } from '@/hooks/useRecipes';
import { theme } from '@/theme';

type Props = NativeStackScreenProps<RecipesStackParamList, 'AddShoppingListItem'>;

const COMMON_UNITS = [
  'Stück',
  'g',
  'kg',
  'ml',
  'l',
  'TL',
  'EL',
  'Prise',
  'Packung',
];

export const AddShoppingListItemScreen: React.FC<Props> = ({ navigation }) => {
  const userId = 'mock-user-id';
  const addToShoppingListMutation = useAddToShoppingList();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('1');
  const [unit, setUnit] = useState('Stück');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Namen ein');
      return;
    }

    const amountNum = parseFloat(amount) || 1;

    addToShoppingListMutation.mutate(
      {
        userId,
        name: name.trim(),
        amount: amountNum,
        unit,
        checked: false,
        recipeId: undefined,
      },
      {
        onSuccess: () => {
          Alert.alert('Erfolg', 'Artikel wurde zur Einkaufsliste hinzugefügt', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
        onError: () => {
          Alert.alert('Fehler', 'Artikel konnte nicht hinzugefügt werden');
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Input
          label="Artikel *"
          value={name}
          onChangeText={setName}
          placeholder="z.B. Milch, Brot, Äpfel..."
          autoFocus
        />

        <View style={styles.row}>
          <View style={styles.amountInput}>
            <Input
              label="Menge"
              value={amount}
              onChangeText={setAmount}
              placeholder="1"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.unitInput}>
            <Text style={styles.label}>Einheit</Text>
            <Text style={styles.selectedUnit}>{unit}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Häufige Einheiten</Text>
          <View style={styles.unitsGrid}>
            {COMMON_UNITS.map((u) => (
              <TouchableOpacity
                key={u}
                style={[
                  styles.unitButton,
                  unit === u && styles.unitButtonActive,
                ]}
                onPress={() => setUnit(u)}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    unit === u && styles.unitButtonTextActive,
                  ]}
                >
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Zur Einkaufsliste hinzufügen"
          onPress={handleSubmit}
          loading={addToShoppingListMutation.isPending}
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
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  amountInput: {
    flex: 1,
  },
  unitInput: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  selectedUnit: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    textAlign: 'center',
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  unitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  unitButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  unitButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  unitButtonTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
});
