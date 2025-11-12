import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, DollarSign, Users, Heart, Share2, ShoppingCart } from 'lucide-react-native';
import { RecipesStackParamList } from '@/navigation/types';
import { Card, LoadingScreen, Button, Badge } from '@/components/common';
import { useRecipe, useToggleFavorite, useAddToShoppingList } from '@/hooks/useRecipes';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/theme';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetails'>;

export const RecipeDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const { user } = useAuth();
  const { data: recipe, isLoading } = useRecipe(recipeId);
  const toggleFavoriteMutation = useToggleFavorite();
  const addToShoppingListMutation = useAddToShoppingList();
  const [isFavorite, setIsFavorite] = useState(false);

  const handleToggleFavorite = () => {
    if (!user) {
      Alert.alert('Fehler', 'Bitte melde dich an');
      return;
    }

    toggleFavoriteMutation.mutate(
      { userId: user.id, recipeId },
      {
        onSuccess: (data) => {
          setIsFavorite(data.isFavorite);
          Alert.alert(
            'Erfolg',
            data.isFavorite ? 'Zu Favoriten hinzugefügt' : 'Aus Favoriten entfernt'
          );
        },
        onError: () => {
          Alert.alert('Fehler', 'Favoriten konnten nicht aktualisiert werden');
        },
      }
    );
  };

  const handleAddToShoppingList = () => {
    if (!user) {
      Alert.alert('Fehler', 'Bitte melde dich an');
      return;
    }

    if (!recipe) return;

    // Add all ingredients to shopping list
    const promises = recipe.ingredients.map((ingredient) =>
      addToShoppingListMutation.mutateAsync({
        userId: user.id,
        recipeId: recipe.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        checked: false,
      })
    );

    Promise.all(promises)
      .then(() => {
        Alert.alert(
          'Erfolg',
          `${recipe.ingredients.length} Zutaten zur Einkaufsliste hinzugefügt`,
          [
            {
              text: 'Zur Einkaufsliste',
              onPress: () => navigation.navigate('ShoppingList'),
            },
            { text: 'OK' },
          ]
        );
      })
      .catch(() => {
        Alert.alert('Fehler', 'Einkaufsliste konnte nicht aktualisiert werden');
      });
  };

  const handleShare = () => {
    Alert.alert('Teilen', 'Teilen-Funktion kommt bald!');
  };

  const getDifficultyBadge = (difficulty: string) => {
    const map: Record<string, { variant: 'success' | 'warning' | 'error'; label: string }> = {
      easy: { variant: 'success', label: 'Einfach' },
      medium: { variant: 'warning', label: 'Mittel' },
      hard: { variant: 'error', label: 'Schwer' },
    };
    return map[difficulty] || map.easy;
  };

  if (isLoading || !recipe) {
    return <LoadingScreen />;
  }

  const difficultyBadge = getDifficultyBadge(recipe.difficulty);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {recipe.imageUrl && (
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      )}

      {/* Floating Action Buttons */}
      <View style={styles.floatingActions}>
        <TouchableOpacity
          style={[styles.actionButton, isFavorite && styles.actionButtonActive]}
          onPress={handleToggleFavorite}
        >
          <Heart
            color={isFavorite ? theme.colors.error : theme.colors.text}
            size={24}
            fill={isFavorite ? theme.colors.error : 'none'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 color={theme.colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Tags and Difficulty */}
        <View style={styles.metaRow}>
          <Badge
            label={difficultyBadge.label}
            variant={difficultyBadge.variant}
            size="sm"
          />
          {recipe.tags && recipe.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} label={tag} variant="secondary" size="sm" />
          ))}
        </View>

        <Text style={styles.description}>{recipe.description}</Text>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <Card style={styles.infoCard}>
            <Clock color={theme.colors.primary} size={24} />
            <Text style={styles.infoValue}>
              {recipe.prepTime + recipe.cookTime}
            </Text>
            <Text style={styles.infoLabel}>Minuten</Text>
          </Card>
          <Card style={styles.infoCard}>
            <Users color={theme.colors.primary} size={24} />
            <Text style={styles.infoValue}>{recipe.servings}</Text>
            <Text style={styles.infoLabel}>Portionen</Text>
          </Card>
          <Card style={styles.infoCard}>
            <DollarSign color={theme.colors.primary} size={24} />
            <Text style={styles.infoValue}>{recipe.estimatedCost.toFixed(2)} €</Text>
            <Text style={styles.infoLabel}>Kosten</Text>
          </Card>
        </View>

        {/* Ingredients */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Zutaten</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientBullet} />
              <Text style={styles.ingredientText}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </Text>
            </View>
          ))}
        </Card>

        {/* Instructions */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Zubereitung</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.instructionNumber}>
                <Text style={styles.instructionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.instructionText}>{instruction}</Text>
            </View>
          ))}
        </Card>

        {/* Nutrition */}
        {recipe.nutrition && (
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Nährwerte (pro Portion)</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.calories}</Text>
                <Text style={styles.nutritionLabel}>kcal</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.protein}g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.carbs}g</Text>
                <Text style={styles.nutritionLabel}>Kohlenhydrate</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>{recipe.nutrition.fat}g</Text>
                <Text style={styles.nutritionLabel}>Fett</Text>
              </View>
            </View>
          </Card>
        )}

        <Button
          title="Zur Einkaufsliste hinzufügen"
          onPress={handleAddToShoppingList}
          fullWidth
          style={styles.addButton}
          icon={<ShoppingCart color={theme.colors.textInverse} size={20} />}
          loading={addToShoppingListMutation.isPending}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  floatingActions: {
    position: 'absolute',
    top: 200,
    right: theme.spacing.md,
    gap: theme.spacing.sm,
    zIndex: 10,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.md,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: theme.spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
    marginBottom: theme.spacing.lg,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  infoValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  ingredientText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  instructionNumberText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  instructionText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  nutritionLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  addButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});
