import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Clock, DollarSign, Heart } from 'lucide-react-native';
import { Recipe } from '@/types';
import { theme } from '@/theme';
import { formatCurrency } from '@/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onPress?: () => void;
  onToggleFavorite?: (recipeId: string) => void;
  isFavorite?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onPress,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      easy: 'Einfach',
      medium: 'Mittel',
      hard: 'Schwer',
    };
    return labels[difficulty as keyof typeof labels] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: theme.colors.success,
      medium: theme.colors.warning,
      hard: theme.colors.error,
    };
    return colors[difficulty as keyof typeof colors] || theme.colors.textSecondary;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {recipe.imageUrl ? (
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>🍳</Text>
        </View>
      )}

      {/* Favorite Button */}
      {onToggleFavorite && (
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(recipe.id)}
        >
          <Heart
            color={isFavorite ? theme.colors.error : theme.colors.textInverse}
            size={20}
            fill={isFavorite ? theme.colors.error : 'transparent'}
          />
        </TouchableOpacity>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Clock color={theme.colors.textSecondary} size={14} />
              <Text style={styles.infoText}>
                {recipe.prepTime + recipe.cookTime} Min
              </Text>
            </View>
            <View style={styles.infoItem}>
              <DollarSign color={theme.colors.textSecondary} size={14} />
              <Text style={styles.infoText}>
                {formatCurrency(recipe.estimatedCost)}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(recipe.difficulty) + '20' },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(recipe.difficulty) },
              ]}
            >
              {getDifficultyLabel(recipe.difficulty)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadow.md,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 48,
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  difficultyText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
