import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RecipesStackParamList } from './types';
import { RecipeListScreen } from '@/screens/recipes/RecipeListScreen';
import { RecipeDetailsScreen } from '@/screens/recipes/RecipeDetailsScreen';
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
    </Stack.Navigator>
  );
};
