import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Clock, DollarSign, Users } from 'lucide-react-native';
import { RecipesStackParamList } from '@/navigation/types';
import { Card, LoadingScreen, Button } from '@/components/common';
import { recipeService } from '@/services/recipeService';
import { theme } from '@/theme';
import { Recipe } from '@/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeDetails'>;

export const RecipeDetailsScreen: React.FC<Props> = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      const data = await recipeService.getRecipeById(recipeId);
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
      // Set mock data
      setMockRecipe();
    } finally {
      setLoading(false);
    }
  };

  const setMockRecipe = () => {
    const mockRecipe: Recipe = {
      id: recipeId,
      title: 'Spaghetti Carbonara',
      description: 'Ein klassisches italienisches Pasta-Gericht, das schnell zubereitet ist und köstlich schmeckt.',
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      difficulty: 'easy',
      estimatedCost: 5.5,
      mealType: ['dinner'],
      dietary: ['none'],
      ingredients: [
        { name: 'Spaghetti', amount: 200, unit: 'g' },
        { name: 'Eier', amount: 2, unit: 'Stück' },
        { name: 'Speck', amount: 100, unit: 'g' },
        { name: 'Parmesan', amount: 50, unit: 'g' },
        { name: 'Schwarzer Pfeffer', amount: 1, unit: 'TL' },
      ],
      instructions: [
        'Wasser in einem großen Topf zum Kochen bringen und Spaghetti nach Packungsanweisung kochen.',
        'Währenddessen Speck in kleine Würfel schneiden und in einer Pfanne knusprig anbraten.',
        'Eier mit geriebenem Parmesan in einer Schüssel verquirlen und mit schwarzem Pfeffer würzen.',
        'Die gekochten Spaghetti abgießen und etwas Kochwasser auffangen.',
        'Die heißen Spaghetti mit dem Speck mischen, vom Herd nehmen und die Ei-Mischung schnell unterrühren.',
        'Falls nötig, etwas Kochwasser hinzufügen für eine cremige Konsistenz.',
        'Sofort servieren und mit zusätzlichem Parmesan und Pfeffer garnieren.',
      ],
      nutrition: {
        calories: 650,
        protein: 28,
        carbs: 75,
        fat: 24,
      },
      tags: ['italienisch', 'pasta', 'schnell'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecipe(mockRecipe);
  };

  if (loading || !recipe) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {recipe.imageUrl && (
        <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
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
          onPress={() => {}}
          fullWidth
          style={styles.addButton}
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
  content: {
    padding: theme.spacing.md,
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
