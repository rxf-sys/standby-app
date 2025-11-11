# 🗄️ StandBy Database Schema

Diese Dokumentation beschreibt die Datenbankstruktur der StandBy App mit Supabase (PostgreSQL).

## 📋 Inhaltsverzeichnis

- [Setup](#setup)
- [Tabellen](#tabellen)
- [Relationships](#relationships)
- [Sicherheit (RLS)](#sicherheit-rls)
- [Seed Data](#seed-data)

## Setup

### 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Kopiere die URL und den Anon Key

### 2. Schema erstellen

Führe die SQL-Datei `schema.sql` in deinem Supabase SQL Editor aus:

```sql
-- Kopiere den Inhalt von schema.sql und führe ihn aus
```

### 3. Environment Variables konfigurieren

Füge in `.env.development` deine Supabase Credentials ein:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## Tabellen

### 👤 profiles

Erweitert die `auth.users` Tabelle von Supabase mit zusätzlichen Benutzerprofil-Daten.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel (referenziert auth.users) |
| email | TEXT | E-Mail-Adresse |
| name | TEXT | Benutzername |
| avatar_url | TEXT | URL zum Profilbild |
| created_at | TIMESTAMP | Erstellungszeitpunkt |
| updated_at | TIMESTAMP | Letztes Update |

### ⚙️ user_preferences

Speichert Benutzereinstellungen.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| user_id | UUID | Referenz zu profiles |
| theme | TEXT | light, dark, auto |
| currency | TEXT | EUR, USD, GBP |
| language | TEXT | de, en |
| notifications_budget | BOOLEAN | Budget-Benachrichtigungen |
| notifications_calendar | BOOLEAN | Kalender-Benachrichtigungen |
| notifications_recipes | BOOLEAN | Rezept-Benachrichtigungen |

### 💰 transactions

Speichert alle Einnahmen und Ausgaben.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| user_id | UUID | Referenz zu profiles |
| type | TEXT | income oder expense |
| amount | DECIMAL | Betrag |
| category | TEXT | Kategorie (food, transport, etc.) |
| description | TEXT | Beschreibung |
| date | TIMESTAMP | Transaktionsdatum |

**Kategorien für Ausgaben:**
- `food` - Essen & Trinken
- `transport` - Transport
- `housing` - Wohnen
- `entertainment` - Unterhaltung
- `health` - Gesundheit
- `education` - Bildung
- `shopping` - Shopping
- `other` - Sonstiges

**Kategorien für Einnahmen:**
- `salary` - Gehalt
- `freelance` - Freiberuflich
- `allowance` - Taschengeld
- `investment` - Investition
- `other` - Sonstiges

### 📊 budgets

Speichert Budget-Limits für Kategorien.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| user_id | UUID | Referenz zu profiles |
| category | TEXT | Ausgaben-Kategorie |
| limit_amount | DECIMAL | Budget-Limit |
| period | TEXT | weekly oder monthly |
| start_date | TIMESTAMP | Startdatum |
| end_date | TIMESTAMP | Enddatum |

### 🎯 savings_goals

Speichert Sparziele.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| user_id | UUID | Referenz zu profiles |
| name | TEXT | Name des Sparziels |
| target_amount | DECIMAL | Zielbetrag |
| current_amount | DECIMAL | Aktueller Betrag |
| target_date | TIMESTAMP | Zieldatum |

### 🍳 recipes

Speichert Rezepte (öffentlich zugänglich).

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| title | TEXT | Titel |
| description | TEXT | Beschreibung |
| image_url | TEXT | Bild-URL |
| prep_time | INTEGER | Vorbereitungszeit (Min) |
| cook_time | INTEGER | Kochzeit (Min) |
| servings | INTEGER | Portionen |
| difficulty | TEXT | easy, medium, hard |
| estimated_cost | DECIMAL | Geschätzte Kosten |
| meal_type | TEXT[] | breakfast, lunch, dinner, snack, dessert |
| dietary | TEXT[] | vegetarian, vegan, gluten-free, lactose-free |
| ingredients | JSONB | Zutatenliste |
| instructions | TEXT[] | Zubereitungsschritte |
| nutrition | JSONB | Nährwertangaben (optional) |
| tags | TEXT[] | Tags für Suche |

### 🛒 shopping_list

Speichert Einkaufslisten-Items.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| user_id | UUID | Referenz zu profiles |
| recipe_id | UUID | Referenz zu recipes (optional) |
| name | TEXT | Name der Zutat |
| amount | DECIMAL | Menge |
| unit | TEXT | Einheit |
| checked | BOOLEAN | Abgehakt |

### 📅 calendar_events

Speichert Kalendertermine.

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | UUID | Primärschlüssel |
| user_id | UUID | Referenz zu profiles |
| title | TEXT | Titel |
| description | TEXT | Beschreibung (optional) |
| category | TEXT | uni, work, personal, health, social, other |
| start_date | TIMESTAMP | Startzeit |
| end_date | TIMESTAMP | Endzeit |
| location | TEXT | Ort (optional) |
| reminder | TEXT | none, 5min, 15min, 30min, 1hour, 1day |
| is_all_day | BOOLEAN | Ganztägig |
| recurring | JSONB | Wiederholungs-Infos (optional) |

## Relationships

```
profiles (1) ----< (∞) transactions
profiles (1) ----< (∞) budgets
profiles (1) ----< (∞) savings_goals
profiles (1) ----< (∞) shopping_list
profiles (1) ----< (∞) calendar_events
profiles (1) ----< (1) user_preferences

recipes (1) ----< (∞) shopping_list [optional]
```

## Sicherheit (RLS)

Row Level Security (RLS) ist für alle Tabellen aktiviert. Benutzer können nur ihre eigenen Daten sehen und bearbeiten.

**Öffentliche Tabellen:**
- `recipes` - Alle können lesen, nur Admins können schreiben

**Private Tabellen:**
- Alle anderen Tabellen sind nur für den jeweiligen Benutzer sichtbar

## Seed Data

### Beispiel-Rezepte hinzufügen

```sql
-- Beispiel-Rezept
INSERT INTO public.recipes (
  title,
  description,
  prep_time,
  cook_time,
  servings,
  difficulty,
  estimated_cost,
  meal_type,
  dietary,
  ingredients,
  instructions,
  tags
) VALUES (
  'Spaghetti Carbonara',
  'Klassisches italienisches Pasta-Gericht',
  10,
  15,
  2,
  'easy',
  5.50,
  ARRAY['dinner'],
  ARRAY['none'],
  '[{"name": "Spaghetti", "amount": 200, "unit": "g"}, {"name": "Eier", "amount": 2, "unit": "Stück"}]'::jsonb,
  ARRAY['Pasta kochen', 'Speck anbraten', 'Ei unterrühren'],
  ARRAY['italienisch', 'pasta', 'schnell']
);
```

## Performance-Optimierung

Die folgenden Indizes sind für optimale Performance erstellt:

- Transactions: `user_id`, `date`, kombiniert
- Calendar Events: `user_id`, `start_date`, kombiniert
- Shopping List: `user_id`, `checked`
- Recipes: GIN-Index auf `meal_type`, `dietary`, `tags`

## Backup

Supabase erstellt automatisch tägliche Backups. Für zusätzliche Sicherheit:

```bash
# PostgreSQL Dump erstellen
pg_dump -h db.your-project.supabase.co -U postgres -d postgres > backup.sql
```
