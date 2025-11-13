export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  userId: string
  theme: 'light' | 'dark' | 'auto'
  currency: 'EUR' | 'USD' | 'GBP'
  language: 'de' | 'en'
  notifications: {
    budget: boolean
    calendar: boolean
    recipes: boolean
  }
}
