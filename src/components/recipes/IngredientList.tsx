import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { theme } from '@/theme';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface IngredientListProps {
  ingredients: Ingredient[];
  servings?: number;
  adjustableServings?: boolean;
  onServingsChange?: (servings: number) => void;
  checkable?: boolean;
  checkedItems?: Set<number>;
  onToggleCheck?: (index: number) => void;
}

export const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  servings = 1,
  adjustableServings = false,
  onServingsChange,
  checkable = false,
  checkedItems = new Set(),
  onToggleCheck,
}) => {
  const handleDecrease = () => {
    if (servings > 1 && onServingsChange) {
      onServingsChange(servings - 1);
    }
  };

  const handleIncrease = () => {
    if (onServingsChange) {
      onServingsChange(servings + 1);
    }
  };

  const adjustAmount = (amount: number): string => {
    if (!adjustableServings) return amount.toString();
    return (amount * (servings / 1)).toFixed(1).replace('.0', '');
  };

  return (
    <View style={styles.container}>
      {adjustableServings && (
        <View style={styles.servingsControl}>
          <Text style={styles.servingsLabel}>Portionen:</Text>
          <View style={styles.servingsButtons}>
            <TouchableOpacity
              style={[styles.servingsButton, servings <= 1 && styles.servingsButtonDisabled]}
              onPress={handleDecrease}
              disabled={servings <= 1}
            >
              <Text style={styles.servingsButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.servingsValue}>{servings}</Text>
            <TouchableOpacity style={styles.servingsButton} onPress={handleIncrease}>
              <Text style={styles.servingsButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient, index) => {
          const isChecked = checkedItems.has(index);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.ingredientItem,
                checkable && styles.ingredientItemCheckable,
                isChecked && styles.ingredientItemChecked,
              ]}
              onPress={() => checkable && onToggleCheck && onToggleCheck(index)}
              disabled={!checkable}
            >
              {checkable && (
                <View
                  style={[styles.checkbox, isChecked && styles.checkboxChecked]}
                >
                  {isChecked && <Check color={theme.colors.textInverse} size={16} />}
                </View>
              )}
              {!checkable && <View style={styles.bullet} />}
              <Text
                style={[
                  styles.ingredientText,
                  isChecked && styles.ingredientTextChecked,
                ]}
              >
                <Text style={styles.ingredientAmount}>
                  {adjustAmount(ingredient.amount)} {ingredient.unit}
                </Text>{' '}
                {ingredient.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  servingsControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.md,
  },
  servingsLabel: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  servingsButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  servingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingsButtonDisabled: {
    backgroundColor: theme.colors.surfaceSecondary,
    opacity: 0.5,
  },
  servingsButtonText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  servingsValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  ingredientsList: {
    gap: theme.spacing.sm,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  ingredientItemCheckable: {
    paddingVertical: theme.spacing.sm,
  },
  ingredientItemChecked: {
    opacity: 0.6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ingredientText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  ingredientTextChecked: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  ingredientAmount: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
});
