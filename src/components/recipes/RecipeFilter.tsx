import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { X, SlidersHorizontal } from 'lucide-react-native';
import { theme } from '@/theme';
import { Button, Badge, Divider } from '@/components/common';
import { RecipeFilter as RecipeFilterType } from '@/types';

interface RecipeFilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filter: RecipeFilterType) => void;
  initialFilter?: RecipeFilterType;
}

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Frühstück' },
  { value: 'lunch', label: 'Mittagessen' },
  { value: 'dinner', label: 'Abendessen' },
  { value: 'snack', label: 'Snack' },
];

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarisch' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Glutenfrei' },
  { value: 'dairy-free', label: 'Laktosefrei' },
  { value: 'low-carb', label: 'Low-Carb' },
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Einfach' },
  { value: 'medium', label: 'Mittel' },
  { value: 'hard', label: 'Schwer' },
];

const TIME_OPTIONS = [
  { value: 15, label: '< 15 Min' },
  { value: 30, label: '< 30 Min' },
  { value: 60, label: '< 60 Min' },
  { value: 120, label: '< 2 Std' },
];

const COST_OPTIONS = [
  { value: 5, label: '< 5€' },
  { value: 10, label: '< 10€' },
  { value: 15, label: '< 15€' },
  { value: 20, label: '< 20€' },
];

export const RecipeFilter: React.FC<RecipeFilterProps> = ({
  visible,
  onClose,
  onApply,
  initialFilter,
}) => {
  const [filter, setFilter] = useState<RecipeFilterType>(
    initialFilter || {
      mealType: [],
      dietary: [],
      difficulty: [],
    }
  );

  const toggleArrayValue = <T,>(
    key: keyof RecipeFilterType,
    value: T
  ) => {
    const currentArray = (filter[key] as T[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    setFilter({ ...filter, [key]: newArray });
  };

  const handleReset = () => {
    setFilter({
      mealType: [],
      dietary: [],
      difficulty: [],
      maxPrepTime: undefined,
      maxCost: undefined,
    });
  };

  const handleApply = () => {
    onApply(filter);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter.mealType?.length) count += filter.mealType.length;
    if (filter.dietary?.length) count += filter.dietary.length;
    if (filter.difficulty?.length) count += filter.difficulty.length;
    if (filter.maxPrepTime) count++;
    if (filter.maxCost) count++;
    return count;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <SlidersHorizontal color={theme.colors.primary} size={24} />
            <Text style={styles.headerTitle}>Filter</Text>
            {getActiveFiltersCount() > 0 && (
              <Badge
                label={getActiveFiltersCount().toString()}
                variant="primary"
                size="sm"
              />
            )}
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Meal Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mahlzeit</Text>
            <View style={styles.optionsGrid}>
              {MEAL_TYPES.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    filter.mealType?.includes(option.value as any) &&
                      styles.optionChipActive,
                  ]}
                  onPress={() => toggleArrayValue('mealType', option.value)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      filter.mealType?.includes(option.value as any) &&
                        styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider spacing={theme.spacing.md} />

          {/* Dietary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ernährungsweise</Text>
            <View style={styles.optionsGrid}>
              {DIETARY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    filter.dietary?.includes(option.value as any) &&
                      styles.optionChipActive,
                  ]}
                  onPress={() => toggleArrayValue('dietary', option.value)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      filter.dietary?.includes(option.value as any) &&
                        styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider spacing={theme.spacing.md} />

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schwierigkeitsgrad</Text>
            <View style={styles.optionsGrid}>
              {DIFFICULTY_LEVELS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    filter.difficulty?.includes(option.value as any) &&
                      styles.optionChipActive,
                  ]}
                  onPress={() => toggleArrayValue('difficulty', option.value)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      filter.difficulty?.includes(option.value as any) &&
                        styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider spacing={theme.spacing.md} />

          {/* Max Prep Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zubereitungszeit</Text>
            <View style={styles.optionsGrid}>
              {TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    filter.maxPrepTime === option.value && styles.optionChipActive,
                  ]}
                  onPress={() =>
                    setFilter({
                      ...filter,
                      maxPrepTime:
                        filter.maxPrepTime === option.value ? undefined : option.value,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      filter.maxPrepTime === option.value && styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Divider spacing={theme.spacing.md} />

          {/* Max Cost */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maximale Kosten</Text>
            <View style={styles.optionsGrid}>
              {COST_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionChip,
                    filter.maxCost === option.value && styles.optionChipActive,
                  ]}
                  onPress={() =>
                    setFilter({
                      ...filter,
                      maxCost:
                        filter.maxCost === option.value ? undefined : option.value,
                    })
                  }
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      filter.maxCost === option.value && styles.optionChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title="Zurücksetzen"
            onPress={handleReset}
            variant="outline"
            style={styles.footerButton}
          />
          <Button
            title="Anwenden"
            onPress={handleApply}
            style={styles.footerButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    paddingVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionChipText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
  },
  optionChipTextActive: {
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  footer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  footerButton: {
    flex: 1,
  },
});
