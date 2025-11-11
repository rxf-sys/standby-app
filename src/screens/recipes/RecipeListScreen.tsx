import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, Clock, DollarSign, ShoppingCart, SlidersHorizontal } from 'lucide-react-native';
import { RecipesStackParamList } from '@/navigation/types';
import { Card, Input, LoadingScreen } from '@/components/common';
import { useRecipeStore } from '@/store/recipeStore';
import { recipeService } from '@/services/recipeService';
import { theme } from '@/theme';
import { Recipe } from '@/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeList'>;

export const RecipeListScreen: React.FC<Props> = ({ navigation }) => {
  const { recipes, setRecipes } = useRecipeStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [searchQuery, recipes]);

  const loadRecipes = async () => {
    try {
      const data = await recipeService.getRecipes();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      // Set mock data for demo
      setMockRecipes();
    } finally {
      setLoading(false);
    }
  };

  const setMockRecipes = () => {
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        title: 'Spaghetti Carbonara',
        description: 'Klassisches italienisches Pasta-Gericht',
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
        ],
        instructions: [
          'Spaghetti nach Packungsanweisung kochen',
          'Speck in Würfel schneiden und anbraten',
          'Eier mit Parmesan verquirlen',
          'Pasta mit Speck mischen und Ei-Mischung unterrühren',
        ],
        tags: ['italienisch', 'pasta', 'schnell'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Buddha Bowl',
        description: 'Gesunde Bowl mit Quinoa und Gemüse',
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        difficulty: 'easy',
        estimatedCost: 6.0,
        mealType: ['lunch', 'dinner'],
        dietary: ['vegetarian', 'vegan'],
        ingredients: [
          { name: 'Quinoa', amount: 150, unit: 'g' },
          { name: 'Süßkartoffel', amount: 200, unit: 'g' },
          { name: 'Kichererbsen', amount: 200, unit: 'g' },
          { name: 'Avocado', amount: 1, unit: 'Stück' },
        ],
        instructions: [
          'Quinoa kochen',
          'Süßkartoffel würfeln und rösten',
          'Kichererbsen anbraten',
          'Alles in einer Bowl anrichten',
        ],
        tags: ['gesund', 'vegetarisch', 'bowl'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Pfannkuchen',
        description: 'Fluffige Pfannkuchen zum Frühstück',
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        difficulty: 'easy',
        estimatedCost: 3.0,
        mealType: ['breakfast'],
        dietary: ['vegetarian'],
        ingredients: [
          { name: 'Mehl', amount: 200, unit: 'g' },
          { name: 'Milch', amount: 300, unit: 'ml' },
          { name: 'Eier', amount: 2, unit: 'Stück' },
          { name: 'Zucker', amount: 30, unit: 'g' },
        ],
        instructions: [
          'Alle Zutaten zu einem glatten Teig verrühren',
          'Teig 10 Minuten ruhen lassen',
          'Portionsweise in der Pfanne ausbacken',
        ],
        tags: ['frühstück', 'süß', 'einfach'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setRecipes(mockRecipes);
    setFilteredRecipes(mockRecipes);
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => (
    <Card
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
    >
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      )}
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.recipeInfo}>
          <View style={styles.infoItem}>
            <Clock color={theme.colors.textSecondary} size={16} />
            <Text style={styles.infoText}>
              {item.prepTime + item.cookTime} Min
            </Text>
          </View>
          <View style={styles.infoItem}>
            <DollarSign color={theme.colors.textSecondary} size={16} />
            <Text style={styles.infoText}>{item.estimatedCost.toFixed(2)} €</Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {item.difficulty === 'easy'
                ? 'Einfach'
                : item.difficulty === 'medium'
                ? 'Mittel'
                : 'Schwer'}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rezepte durchsuchen..."
          leftIcon={<Search color={theme.colors.textSecondary} size={20} />}
          containerStyle={styles.searchInput}
        />
        <TouchableOpacity
          style={styles.advancedSearchButton}
          onPress={() => navigation.navigate('RecipeSearch')}
        >
          <SlidersHorizontal color={theme.colors.primary} size={24} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Keine Rezepte gefunden</Text>
          </View>
        }
      />

      {/* Shopping List FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ShoppingList')}
      >
        <ShoppingCart color={theme.colors.textInverse} size={24} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
  },
  advancedSearchButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  recipeCard: {
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    padding: 0,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  recipeContent: {
    padding: theme.spacing.md,
  },
  recipeTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recipeDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  recipeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textInverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
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
