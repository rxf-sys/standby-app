import { create } from 'zustand';
import { Recipe, ShoppingListItem } from '@/types';

interface RecipeState {
  recipes: Recipe[];
  favoriteRecipes: string[];
  shoppingList: ShoppingListItem[];
  setRecipes: (recipes: Recipe[]) => void;
  toggleFavorite: (recipeId: string) => void;
  setShoppingList: (items: ShoppingListItem[]) => void;
  addToShoppingList: (item: ShoppingListItem) => void;
  updateShoppingListItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  deleteShoppingListItem: (id: string) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  favoriteRecipes: [],
  shoppingList: [],

  setRecipes: (recipes) => set({ recipes }),

  toggleFavorite: (recipeId) =>
    set((state) => ({
      favoriteRecipes: state.favoriteRecipes.includes(recipeId)
        ? state.favoriteRecipes.filter((id) => id !== recipeId)
        : [...state.favoriteRecipes, recipeId],
    })),

  setShoppingList: (shoppingList) => set({ shoppingList }),

  addToShoppingList: (item) =>
    set((state) => ({
      shoppingList: [...state.shoppingList, item],
    })),

  updateShoppingListItem: (id, updates) =>
    set((state) => ({
      shoppingList: state.shoppingList.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  deleteShoppingListItem: (id) =>
    set((state) => ({
      shoppingList: state.shoppingList.filter((item) => item.id !== id),
    })),
}));
