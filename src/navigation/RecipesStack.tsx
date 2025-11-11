import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipesStackParamList } from './types';
import { RecipeListScreen } from '@/screens/recipes/RecipeListScreen';
import { RecipeDetailsScreen } from '@/screens/recipes/RecipeDetailsScreen';
import { ShoppingListScreen } from '@/screens/recipes/ShoppingListScreen';
import { RecipeSearchScreen } from '@/screens/recipes/RecipeSearchScreen';
import { AddShoppingListItemScreen } from '@/screens/recipes/AddShoppingListItemScreen';
import { theme } from '@/theme';

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export const RecipesStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.typography.fontWeight.semibold,
        },
      }}
    >
      <Stack.Screen
        name="RecipeList"
        component={RecipeListScreen}
        options={{ title: 'Rezepte' }}
      />
      <Stack.Screen
        name="RecipeDetails"
        component={RecipeDetailsScreen}
        options={{ title: 'Rezept Details' }}
      />
      <Stack.Screen
        name="ShoppingList"
        component={ShoppingListScreen}
        options={{ title: 'Einkaufsliste' }}
      />
      <Stack.Screen
        name="RecipeSearch"
        component={RecipeSearchScreen}
        options={{ title: 'Rezepte suchen' }}
      />
      <Stack.Screen
        name="AddShoppingListItem"
        component={AddShoppingListItemScreen}
        options={{ title: 'Artikel hinzufügen' }}
      />
    </Stack.Navigator>
  );
};
