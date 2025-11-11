import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeService } from '@/services/recipeService';
import { useRecipeStore } from '@/store/recipeStore';
import { Recipe, RecipeFilter, ShoppingListItem } from '@/types';

const QUERY_KEYS = {
  recipes: (filter?: RecipeFilter) => ['recipes', filter],
  recipe: (id: string) => ['recipe', id],
  shoppingList: (userId: string) => ['shoppingList', userId],
};

// Recipes
export const useRecipes = (filter?: RecipeFilter) => {
  const { setRecipes } = useRecipeStore();

  return useQuery({
    queryKey: QUERY_KEYS.recipes(filter),
    queryFn: async () => {
      const data = await recipeService.getRecipes(filter);
      setRecipes(data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRecipe = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.recipe(id),
    queryFn: () => recipeService.getRecipeById(id),
    enabled: !!id,
  });
};

export const useSearchRecipes = () => {
  return useMutation({
    mutationFn: (searchTerm: string) => recipeService.searchRecipes(searchTerm),
  });
};

// Shopping List
export const useShoppingList = (userId: string) => {
  const { setShoppingList } = useRecipeStore();

  return useQuery({
    queryKey: QUERY_KEYS.shoppingList(userId),
    queryFn: async () => {
      const data = await recipeService.getShoppingList(userId);
      setShoppingList(data);
      return data;
    },
  });
};

export const useAddToShoppingList = () => {
  const queryClient = useQueryClient();
  const { addToShoppingList } = useRecipeStore();

  return useMutation({
    mutationFn: (item: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt'>) =>
      recipeService.addToShoppingList(item),
    onSuccess: (data) => {
      addToShoppingList(data);
      queryClient.invalidateQueries({ queryKey: ['shoppingList'] });
    },
  });
};

export const useUpdateShoppingListItem = () => {
  const queryClient = useQueryClient();
  const { updateShoppingListItem } = useRecipeStore();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ShoppingListItem> }) =>
      recipeService.updateShoppingListItem(id, updates),
    onSuccess: (data) => {
      updateShoppingListItem(data.id, data);
      queryClient.invalidateQueries({ queryKey: ['shoppingList'] });
    },
  });
};

export const useDeleteShoppingListItem = () => {
  const queryClient = useQueryClient();
  const { deleteShoppingListItem } = useRecipeStore();

  return useMutation({
    mutationFn: (id: string) => recipeService.deleteShoppingListItem(id),
    onSuccess: (_, id) => {
      deleteShoppingListItem(id);
      queryClient.invalidateQueries({ queryKey: ['shoppingList'] });
    },
  });
};
