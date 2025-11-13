export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'lactose-free'
  | 'none'

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  name: string
  amount: number
  unit: string
}

export interface Recipe {
  id: string
  title: string
  description: string
  imageUrl?: string
  prepTime: number // in minutes
  cookTime: number // in minutes
  servings: number
  difficulty: Difficulty
  estimatedCost: number // in euros
  mealType: MealType[]
  dietary: DietaryRestriction[]
  ingredients: Ingredient[]
  instructions: string[]
  nutrition?: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  tags: string[]
  isFavorite?: boolean
  createdAt: string
  updatedAt: string
}

export interface ShoppingListItem {
  id: string
  userId: string
  recipeId?: string
  name: string
  amount: number
  unit: string
  checked: boolean
  createdAt: string
  updatedAt: string
}

export interface RecipeFilter {
  mealType?: MealType[]
  dietary?: DietaryRestriction[]
  maxPrepTime?: number
  maxCost?: number
  difficulty?: Difficulty[]
  ingredients?: string[]
}
