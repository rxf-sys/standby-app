import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { RecipesStackParamList } from '@/navigation/types';
import { LoadingScreen, EmptyState, Badge } from '@/components/common';
import { RecipeCard, RecipeFilter } from '@/components/recipes';
import { useSearchRecipes, useRecipes } from '@/hooks/useRecipes';
import { theme } from '@/theme';
import { Recipe, RecipeFilter as RecipeFilterType } from '@/types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeSearch'>;

export const RecipeSearchScreen: React.FC<Props> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<RecipeFilterType>({
    mealType: [],
    dietary: [],
    difficulty: [],
  });

  const searchMutation = useSearchRecipes();
  const { data: allRecipes, isLoading: isLoadingAll } = useRecipes(filter);

  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    searchMutation.mutate(searchTerm, {
      onSuccess: (data) => {
        // Apply local filtering on search results
        let filtered = data;

        if (filter.mealType?.length) {
          filtered = filtered.filter((recipe) =>
            recipe.mealType.some((type) => filter.mealType?.includes(type))
          );
        }

        if (filter.dietary?.length) {
          filtered = filtered.filter((recipe) =>
            recipe.dietary.some((diet) => filter.dietary?.includes(diet))
          );
        }

        if (filter.difficulty?.length) {
          filtered = filtered.filter((recipe) =>
            filter.difficulty?.includes(recipe.difficulty as any)
          );
        }

        if (filter.maxPrepTime) {
          filtered = filtered.filter(
            (recipe) => recipe.prepTime + recipe.cookTime <= (filter.maxPrepTime || Infinity)
          );
        }

        if (filter.maxCost) {
          filtered = filtered.filter(
            (recipe) => recipe.estimatedCost <= (filter.maxCost || Infinity)
          );
        }

        setSearchResults(filtered);
      },
    });
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleFilterApply = (newFilter: RecipeFilterType) => {
    setFilter(newFilter);
    if (hasSearched && searchTerm) {
      // Re-run search with new filter
      handleSearch();
    }
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

  const displayRecipes = hasSearched ? searchResults : (allRecipes || []);
  const isLoading = searchMutation.isPending || isLoadingAll;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Search color={theme.colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rezepte durchsuchen..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X color={theme.colors.textSecondary} size={20} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(true)}
        >
          <SlidersHorizontal color={theme.colors.primary} size={24} />
          {getActiveFiltersCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersLabel}>Aktive Filter:</Text>
          <View style={styles.activeFiltersList}>
            {filter.mealType?.map((type) => (
              <Badge key={type} label={type} variant="primary" size="sm" />
            ))}
            {filter.dietary?.map((diet) => (
              <Badge key={diet} label={diet} variant="secondary" size="sm" />
            ))}
            {filter.difficulty?.map((diff) => (
              <Badge key={diff} label={diff} variant="info" size="sm" />
            ))}
            {filter.maxPrepTime && (
              <Badge label={`< ${filter.maxPrepTime} Min`} variant="warning" size="sm" />
            )}
            {filter.maxCost && (
              <Badge label={`< ${filter.maxCost}€`} variant="success" size="sm" />
            )}
          </View>
        </View>
      )}

      {/* Results */}
      {isLoading ? (
        <LoadingScreen />
      ) : displayRecipes.length === 0 ? (
        <EmptyState
          title={hasSearched ? 'Keine Rezepte gefunden' : 'Suche Rezepte'}
          message={
            hasSearched
              ? 'Versuche es mit anderen Suchbegriffen oder Filtern'
              : 'Gib einen Suchbegriff ein oder verwende Filter'
          }
          icon={Search}
        />
      ) : (
        <FlatList
          data={displayRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <RecipeFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleFilterApply}
        initialFilter={filter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    paddingVertical: theme.spacing.sm,
  },
  filterButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.background,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
  },
  activeFilters: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activeFiltersLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  activeFiltersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});
