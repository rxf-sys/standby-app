# 📡 StandBy API Documentation

Diese Dokumentation beschreibt die API-Services und Hooks der StandBy App.

## 📋 Inhaltsverzeichnis

- [Architektur](#architektur)
- [Services](#services)
- [Custom Hooks](#custom-hooks)
- [Typen](#typen)
- [Error Handling](#error-handling)

## Architektur

Die App verwendet eine mehrschichtige Architektur:

```
┌─────────────────┐
│   Screens       │ (UI Layer)
└────────┬────────┘
         │
┌────────▼────────┐
│  Custom Hooks   │ (React Query Hooks)
└────────┬────────┘
         │
┌────────▼────────┐
│   Services      │ (Business Logic)
└────────┬────────┘
         │
┌────────▼────────┐
│   Supabase      │ (Backend/Database)
└─────────────────┘
```

## Services

### BudgetService

Verwaltet Transaktionen, Budgets und Sparziele.

#### getTransactions(userId: string)

Holt alle Transaktionen eines Benutzers.

```typescript
const transactions = await budgetService.getTransactions(userId);
```

**Response:**
```typescript
Transaction[] = [{
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}]
```

#### createTransaction(transaction)

Erstellt eine neue Transaktion.

```typescript
const newTransaction = await budgetService.createTransaction({
  userId: 'user-123',
  type: 'expense',
  amount: 25.50,
  category: 'food',
  description: 'Supermarkt',
  date: new Date().toISOString(),
});
```

#### updateTransaction(id, updates)

Aktualisiert eine Transaktion.

```typescript
await budgetService.updateTransaction('transaction-123', {
  amount: 30.00,
  description: 'Supermarkt (korrigiert)',
});
```

#### deleteTransaction(id)

Löscht eine Transaktion.

```typescript
await budgetService.deleteTransaction('transaction-123');
```

#### getBudgets(userId)

Holt alle Budgets eines Benutzers.

```typescript
const budgets = await budgetService.getBudgets(userId);
```

#### createBudget(budget)

Erstellt ein neues Budget.

```typescript
const budget = await budgetService.createBudget({
  userId: 'user-123',
  category: 'food',
  limit: 200,
  period: 'monthly',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});
```

#### getSavingsGoals(userId)

Holt alle Sparziele eines Benutzers.

```typescript
const goals = await budgetService.getSavingsGoals(userId);
```

#### createSavingsGoal(goal)

Erstellt ein neues Sparziel.

```typescript
const goal = await budgetService.createSavingsGoal({
  userId: 'user-123',
  name: 'Urlaub',
  targetAmount: 1000,
  currentAmount: 0,
  targetDate: '2024-12-31',
});
```

#### updateSavingsGoal(id, updates)

Aktualisiert ein Sparziel.

```typescript
await budgetService.updateSavingsGoal('goal-123', {
  currentAmount: 250,
});
```

### RecipeService

Verwaltet Rezepte und Einkaufslisten.

#### getRecipes(filter?)

Holt Rezepte mit optionalem Filter.

```typescript
const recipes = await recipeService.getRecipes({
  mealType: ['dinner'],
  maxPrepTime: 30,
  dietary: ['vegetarian'],
});
```

**Filter-Optionen:**
```typescript
{
  mealType?: MealType[];
  dietary?: DietaryRestriction[];
  maxPrepTime?: number;
  maxCost?: number;
  difficulty?: Difficulty[];
  ingredients?: string[];
}
```

#### getRecipeById(id)

Holt ein einzelnes Rezept.

```typescript
const recipe = await recipeService.getRecipeById('recipe-123');
```

#### searchRecipes(searchTerm)

Sucht Rezepte nach Suchbegriff.

```typescript
const results = await recipeService.searchRecipes('pasta');
```

#### getShoppingList(userId)

Holt die Einkaufsliste eines Benutzers.

```typescript
const items = await recipeService.getShoppingList(userId);
```

#### addToShoppingList(item)

Fügt ein Item zur Einkaufsliste hinzu.

```typescript
await recipeService.addToShoppingList({
  userId: 'user-123',
  recipeId: 'recipe-123',
  name: 'Tomaten',
  amount: 500,
  unit: 'g',
  checked: false,
});
```

#### updateShoppingListItem(id, updates)

Aktualisiert ein Einkaufslisten-Item.

```typescript
await recipeService.updateShoppingListItem('item-123', {
  checked: true,
});
```

#### deleteShoppingListItem(id)

Löscht ein Einkaufslisten-Item.

```typescript
await recipeService.deleteShoppingListItem('item-123');
```

### CalendarService

Verwaltet Kalendertermine.

#### getEvents(userId, filter?)

Holt alle Termine eines Benutzers.

```typescript
const events = await calendarService.getEvents(userId, {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  categories: ['uni', 'work'],
});
```

#### getEventById(id)

Holt einen einzelnen Termin.

```typescript
const event = await calendarService.getEventById('event-123');
```

#### createEvent(event)

Erstellt einen neuen Termin.

```typescript
const event = await calendarService.createEvent({
  userId: 'user-123',
  title: 'Vorlesung Mathematik',
  description: 'Lineare Algebra',
  category: 'uni',
  startDate: '2024-01-15T10:00:00Z',
  endDate: '2024-01-15T12:00:00Z',
  location: 'Hörsaal A',
  reminder: '15min',
  isAllDay: false,
});
```

#### updateEvent(id, updates)

Aktualisiert einen Termin.

```typescript
await calendarService.updateEvent('event-123', {
  startDate: '2024-01-15T11:00:00Z',
  endDate: '2024-01-15T13:00:00Z',
});
```

#### deleteEvent(id)

Löscht einen Termin.

```typescript
await calendarService.deleteEvent('event-123');
```

## Custom Hooks

Die App verwendet React Query (TanStack Query) für API-Calls. Alle Hooks sind in `/src/hooks/` definiert.

### Budget Hooks

#### useTransactions(userId)

```typescript
const { data, isLoading, error } = useTransactions(userId);
```

#### useCreateTransaction()

```typescript
const { mutate: createTransaction, isPending } = useCreateTransaction();

createTransaction({
  userId: 'user-123',
  type: 'expense',
  amount: 25.50,
  category: 'food',
  description: 'Supermarkt',
  date: new Date().toISOString(),
});
```

#### useUpdateTransaction()

```typescript
const { mutate: updateTransaction } = useUpdateTransaction();

updateTransaction({
  id: 'transaction-123',
  updates: { amount: 30.00 },
});
```

#### useDeleteTransaction()

```typescript
const { mutate: deleteTransaction } = useDeleteTransaction();

deleteTransaction('transaction-123');
```

### Recipe Hooks

#### useRecipes(filter?)

```typescript
const { data: recipes, isLoading } = useRecipes({
  mealType: ['dinner'],
  maxPrepTime: 30,
});
```

#### useRecipe(id)

```typescript
const { data: recipe, isLoading } = useRecipe('recipe-123');
```

#### useSearchRecipes()

```typescript
const { mutate: searchRecipes, data: results } = useSearchRecipes();

searchRecipes('pasta');
```

### Calendar Hooks

#### useEvents(userId, filter?)

```typescript
const { data: events, isLoading } = useEvents(userId, {
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});
```

#### useCreateEvent()

```typescript
const { mutate: createEvent } = useCreateEvent();

createEvent({
  userId: 'user-123',
  title: 'Meeting',
  startDate: new Date().toISOString(),
  endDate: new Date(Date.now() + 3600000).toISOString(),
  category: 'work',
  reminder: '15min',
  isAllDay: false,
});
```

## Typen

### Transaction

```typescript
interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  amount: number;
  category: ExpenseCategory | IncomeSource;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'housing'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'shopping'
  | 'other';

type IncomeSource =
  | 'salary'
  | 'freelance'
  | 'allowance'
  | 'investment'
  | 'other';
```

### Recipe

```typescript
interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedCost: number;
  mealType: MealType[];
  dietary: DietaryRestriction[];
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: Nutrition;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}
```

### CalendarEvent

```typescript
interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location?: string;
  reminder: ReminderType;
  isAllDay: boolean;
  recurring?: RecurringInfo;
  createdAt: string;
  updatedAt: string;
}

type EventCategory =
  | 'uni'
  | 'work'
  | 'personal'
  | 'health'
  | 'social'
  | 'other';

type ReminderType =
  | 'none'
  | '5min'
  | '15min'
  | '30min'
  | '1hour'
  | '1day';
```

## Error Handling

### Try-Catch Pattern

Alle Service-Funktionen können Fehler werfen. Verwende Try-Catch:

```typescript
try {
  const transaction = await budgetService.createTransaction(data);
  console.log('Success:', transaction);
} catch (error) {
  console.error('Error creating transaction:', error);
  Alert.alert('Fehler', 'Transaktion konnte nicht erstellt werden');
}
```

### React Query Error Handling

React Query Hooks haben eingebautes Error Handling:

```typescript
const { data, isLoading, error } = useTransactions(userId);

if (error) {
  return <Text>Error: {error.message}</Text>;
}
```

### Global Error Boundary

Die App hat einen globalen ErrorBoundary in `App.tsx`:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Supabase Errors

Supabase gibt strukturierte Fehler zurück:

```typescript
{
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  }
}
```

## Best Practices

1. **Immer TypeScript-Typen verwenden**
   ```typescript
   const transaction: Transaction = await budgetService.getTransaction(id);
   ```

2. **React Query für Caching nutzen**
   ```typescript
   // Automatisches Caching und Revalidierung
   const { data } = useTransactions(userId);
   ```

3. **Optimistic Updates**
   ```typescript
   const { mutate } = useUpdateTransaction();
   mutate({ id, updates }, {
     onSuccess: () => {
       queryClient.invalidateQueries(['transactions']);
     },
   });
   ```

4. **Error Boundaries für kritische Bereiche**
   ```typescript
   <ErrorBoundary fallback={<CustomErrorScreen />}>
     <CriticalComponent />
   </ErrorBoundary>
   ```

5. **Loading States anzeigen**
   ```typescript
   if (isLoading) return <LoadingScreen />;
   if (error) return <ErrorScreen error={error} />;
   return <DataView data={data} />;
   ```
