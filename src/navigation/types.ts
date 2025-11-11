import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
  ProfileEdit: undefined;
  ChangePassword: undefined;
  ThemeSettings: undefined;
  NotificationSettings: undefined;
};

export type TabParamList = {
  BudgetTab: NavigatorScreenParams<BudgetStackParamList>;
  RecipesTab: NavigatorScreenParams<RecipesStackParamList>;
  CalendarTab: NavigatorScreenParams<CalendarStackParamList>;
  ProfileTab: undefined;
};

export type BudgetStackParamList = {
  BudgetOverview: undefined;
  AddTransaction: { type: 'income' | 'expense' };
  TransactionDetails: { transactionId: string };
  BudgetSettings: undefined;
  SavingsGoals: undefined;
  AddSavingsGoal: undefined;
  BudgetStatistics: undefined;
};

export type RecipesStackParamList = {
  RecipeList: undefined;
  RecipeDetails: { recipeId: string };
  ShoppingList: undefined;
  RecipeSearch: undefined;
  AddShoppingListItem: undefined;
};

export type CalendarStackParamList = {
  CalendarView: undefined;
  EventDetails: { eventId: string };
  AddEvent: { date?: string };
  EditEvent: { eventId: string };
};
