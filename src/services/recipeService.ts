import { supabase } from './supabase';
import { Recipe, ShoppingListItem, RecipeFilter } from '@/types';

export const recipeService = {
  // Recipes
  async getRecipes(filter?: RecipeFilter) {
    let query = supabase.from('recipes').select('*');

    if (filter?.mealType?.length) {
      query = query.contains('mealType', filter.mealType);
    }

    if (filter?.dietary?.length) {
      query = query.contains('dietary', filter.dietary);
    }

    if (filter?.maxPrepTime) {
      query = query.lte('prepTime', filter.maxPrepTime);
    }

    if (filter?.maxCost) {
      query = query.lte('estimatedCost', filter.maxCost);
    }

    if (filter?.difficulty?.length) {
      query = query.in('difficulty', filter.difficulty);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Recipe[];
  },

  async getRecipeById(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Recipe;
  },

  async searchRecipes(searchTerm: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .limit(20);

    if (error) throw error;
    return data as Recipe[];
  },

  // Shopping List
  async getShoppingList(userId: string) {
    const { data, error } = await supabase
      .from('shopping_list')
      .select('*')
      .eq('userId', userId)
      .order('checked', { ascending: true });

    if (error) throw error;
    return data as ShoppingListItem[];
  },

  async addToShoppingList(item: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabase
      .from('shopping_list')
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data as ShoppingListItem;
  },

  async updateShoppingListItem(id: string, updates: Partial<ShoppingListItem>) {
    const { data, error } = await supabase
      .from('shopping_list')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ShoppingListItem;
  },

  async deleteShoppingListItem(id: string) {
    const { error } = await supabase
      .from('shopping_list')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Favorites
  async toggleFavorite(userId: string, recipeId: string) {
    // Check if favorite exists
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('userId', userId)
      .eq('recipeId', recipeId)
      .single();

    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('userId', userId)
        .eq('recipeId', recipeId);

      if (error) throw error;
      return { isFavorite: false };
    } else {
      // Add favorite
      const { error } = await supabase
        .from('user_favorites')
        .insert({ userId, recipeId });

      if (error) throw error;
      return { isFavorite: true };
    }
  },

  async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('recipeId, recipes(*)')
      .eq('userId', userId);

    if (error) throw error;
    return data?.map((item: any) => item.recipes) as Recipe[];
  },
};
