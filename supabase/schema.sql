-- StandBy App Database Schema
-- This file contains the complete database schema for the StandBy app
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE (extends auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TRANSACTIONS TABLE (Budget)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON public.transactions(category);

-- RLS Policies for transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- BUDGETS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly', 'weekly', 'yearly')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for budgets
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON public.budgets(category);

-- RLS Policies for budgets
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SAVINGS GOALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  deadline TIMESTAMPTZ,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for savings_goals
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);

-- RLS Policies for savings_goals
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own savings goals"
  ON public.savings_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
  ON public.savings_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
  ON public.savings_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
  ON public.savings_goals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- RECIPES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER, -- in minutes
  cook_time INTEGER, -- in minutes
  servings INTEGER DEFAULT 4,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  meal_type TEXT[], -- array: ['breakfast', 'lunch', 'dinner', 'snack']
  dietary TEXT[], -- array: ['vegetarian', 'vegan', 'gluten-free', etc.]
  ingredients JSONB NOT NULL, -- [{ name, amount, unit }]
  instructions TEXT[] NOT NULL, -- array of step descriptions
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for recipes
CREATE INDEX IF NOT EXISTS idx_recipes_meal_type ON public.recipes USING GIN(meal_type);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary ON public.recipes USING GIN(dietary);
CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON public.recipes(difficulty);

-- RLS Policies for recipes (public read, admin write)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view recipes"
  ON public.recipes FOR SELECT
  USING (true);

-- ============================================================================
-- FAVORITE RECIPES TABLE (User-Recipe relationship)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.favorite_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Indexes for favorite_recipes
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_user_id ON public.favorite_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_recipes_recipe_id ON public.favorite_recipes(recipe_id);

-- RLS Policies for favorite_recipes
ALTER TABLE public.favorite_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.favorite_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorite_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorite_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- SHOPPING LIST TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shopping_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  checked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for shopping_list
CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id ON public.shopping_list(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_checked ON public.shopping_list(checked);

-- RLS Policies for shopping_list
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shopping list"
  ON public.shopping_list FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopping list items"
  ON public.shopping_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping list items"
  ON public.shopping_list FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping list items"
  ON public.shopping_list FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- CALENDAR EVENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  category TEXT NOT NULL CHECK (category IN ('uni', 'work', 'personal', 'health', 'social', 'other')),
  reminder TEXT CHECK (reminder IN ('none', '5min', '15min', '30min', '1hour', '1day')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for calendar_events
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON public.calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_category ON public.calendar_events(category);

-- RLS Policies for calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
  ON public.calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own events"
  ON public.calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON public.calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON public.calendar_events FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_list_updated_at BEFORE UPDATE ON public.shopping_list
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- SEED DATA (Sample Recipes)
-- ============================================================================

-- Insert sample recipes
INSERT INTO public.recipes (title, description, image_url, prep_time, cook_time, servings, difficulty, meal_type, dietary, ingredients, instructions, tags)
VALUES
  (
    'Spaghetti Carbonara',
    'Klassisches italienisches Pasta-Gericht mit Speck, Ei und Parmesan',
    'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    10,
    15,
    4,
    'medium',
    ARRAY['lunch', 'dinner'],
    ARRAY[''],
    '[
      {"name": "Spaghetti", "amount": 400, "unit": "g"},
      {"name": "Speck", "amount": 200, "unit": "g"},
      {"name": "Eier", "amount": 4, "unit": "Stück"},
      {"name": "Parmesan", "amount": 100, "unit": "g"},
      {"name": "Knoblauch", "amount": 2, "unit": "Zehen"},
      {"name": "Salz", "amount": 1, "unit": "Prise"},
      {"name": "Pfeffer", "amount": 1, "unit": "Prise"}
    ]'::jsonb,
    ARRAY[
      'Spaghetti nach Packungsanweisung kochen',
      'Speck in Würfel schneiden und knusprig braten',
      'Eier mit geriebenem Parmesan verquirlen',
      'Nudeln abgießen, Ei-Mischung unterrühren',
      'Speck hinzufügen und mit Salz & Pfeffer abschmecken'
    ],
    ARRAY['italienisch', 'pasta', 'schnell']
  ),
  (
    'Avocado Toast',
    'Gesundes Frühstück mit Avocado auf geröstetem Brot',
    'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    5,
    5,
    2,
    'easy',
    ARRAY['breakfast', 'snack'],
    ARRAY['vegetarian', 'vegan'],
    '[
      {"name": "Vollkornbrot", "amount": 4, "unit": "Scheiben"},
      {"name": "Avocado", "amount": 2, "unit": "Stück"},
      {"name": "Zitronensaft", "amount": 1, "unit": "EL"},
      {"name": "Salz", "amount": 1, "unit": "Prise"},
      {"name": "Pfeffer", "amount": 1, "unit": "Prise"},
      {"name": "Chiliflocken", "amount": 1, "unit": "Prise"}
    ]'::jsonb,
    ARRAY[
      'Brot toasten',
      'Avocado halbieren, entkernen und das Fruchtfleisch herauslösen',
      'Avocado mit Zitronensaft, Salz und Pfeffer zerdrücken',
      'Auf geröstetem Brot verteilen',
      'Mit Chiliflocken garnieren'
    ],
    ARRAY['gesund', 'schnell', 'vegan']
  ),
  (
    'Hühnersuppe',
    'Wärmende Suppe mit Hähnchen und Gemüse',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    15,
    45,
    6,
    'easy',
    ARRAY['lunch', 'dinner'],
    ARRAY['gluten-free'],
    '[
      {"name": "Hähnchenbrust", "amount": 500, "unit": "g"},
      {"name": "Karotten", "amount": 3, "unit": "Stück"},
      {"name": "Sellerie", "amount": 2, "unit": "Stangen"},
      {"name": "Zwiebel", "amount": 1, "unit": "Stück"},
      {"name": "Knoblauch", "amount": 3, "unit": "Zehen"},
      {"name": "Hühnerbrühe", "amount": 1.5, "unit": "l"},
      {"name": "Nudeln", "amount": 200, "unit": "g"},
      {"name": "Petersilie", "amount": 1, "unit": "Bund"}
    ]'::jsonb,
    ARRAY[
      'Hähnchen in Würfel schneiden',
      'Gemüse klein schneiden',
      'Zwiebel und Knoblauch in Topf anbraten',
      'Hähnchen und Gemüse hinzufügen',
      'Mit Brühe aufgießen und 30 Minuten köcheln',
      'Nudeln hinzufügen und weitere 10 Minuten kochen',
      'Mit Petersilie garnieren'
    ],
    ARRAY['suppe', 'comfort-food', 'gesund']
  );

-- ============================================================================
-- VIEWS (Optional - for easier data access)
-- ============================================================================

-- View for transactions with user info
CREATE OR REPLACE VIEW public.transactions_with_user AS
SELECT
  t.*,
  u.name as user_name,
  u.email as user_email
FROM public.transactions t
JOIN public.users u ON t.user_id = u.id;

-- View for recipes with favorite count
CREATE OR REPLACE VIEW public.recipes_with_stats AS
SELECT
  r.*,
  COUNT(fr.id) as favorite_count
FROM public.recipes r
LEFT JOIN public.favorite_recipes fr ON r.id = fr.recipe_id
GROUP BY r.id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.users IS 'User profiles extending auth.users';
COMMENT ON TABLE public.transactions IS 'Financial transactions (income/expense)';
COMMENT ON TABLE public.budgets IS 'Budget limits by category';
COMMENT ON TABLE public.savings_goals IS 'User savings goals';
COMMENT ON TABLE public.recipes IS 'Recipe database';
COMMENT ON TABLE public.favorite_recipes IS 'User favorite recipes';
COMMENT ON TABLE public.shopping_list IS 'User shopping list items';
COMMENT ON TABLE public.calendar_events IS 'User calendar events';
