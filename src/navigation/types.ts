import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
};

export type TabParamList = {
  BudgetTab: NavigatorScreenParams<BudgetStackParamList>;
  RecipesTab: NavigatorScreenParams<RecipesStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarStackParamList>;
};

export type BudgetStackParamList = {
  BudgetOverview: undefined;
  AddTransaction: { type: 'income' | 'expense' };
  TransactionDetails: { transactionId: string };
  BudgetSettings: undefined;
  SavingsGoals: undefined;
  AddSavingsGoal: undefined;
};

export type RecipesStackParamList = {
  RecipeList: undefined;
  RecipeDetails: { recipeId: string };
  ShoppingList: undefined;
  RecipeSearch: undefined;
};

export type CalendarStackParamList = {
  CalendarView: undefined;
  EventDetails: { eventId: string };
  AddEvent: { date?: string };
  EditEvent: { eventId: string };
};
