# 🧪 Testing-Anleitung - StandBy App

Umfassende Anleitung zum Testen der Benutzeroberfläche und des Backends mit echten Benutzern.

## 📋 Inhaltsverzeichnis

1. [Voraussetzungen](#voraussetzungen)
2. [Backend Setup (Supabase)](#backend-setup-supabase)
3. [App lokal starten](#app-lokal-starten)
4. [Testbenutzer erstellen](#testbenutzer-erstellen)
5. [UI/UX Testing](#uiux-testing)
6. [Backend Testing](#backend-testing)
7. [Testen auf echten Geräten](#testen-auf-echten-geräten)
8. [Beta Testing](#beta-testing)
9. [Troubleshooting](#troubleshooting)

---

## Voraussetzungen

### Software Installation

```bash
# Node.js 20+ überprüfen
node --version  # sollte >= 20.x.x sein

# npm oder yarn überprüfen
npm --version

# Expo CLI installieren (falls nicht vorhanden)
npm install -g expo-cli

# EAS CLI installieren (für Builds)
npm install -g eas-cli
```

### Erforderliche Accounts

- **Expo Account**: [expo.dev](https://expo.dev) - Kostenlos registrieren
- **Supabase Account**: [supabase.com](https://supabase.com) - Kostenlos registrieren

---

## Backend Setup (Supabase)

### 1. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Klicke auf "Start your project"
3. Erstelle eine neue Organisation (falls noch keine vorhanden)
4. Klicke auf "New Project"
   - **Name**: standby-app-dev (oder beliebig)
   - **Database Password**: Starkes Passwort generieren & speichern
   - **Region**: Europe (Frankfurt) für DSGVO-Konformität
5. Warte 1-2 Minuten bis das Projekt erstellt ist

### 2. Datenbank Schema einrichten

Gehe zu **SQL Editor** im Supabase Dashboard und führe folgende Queries aus:

```sql
-- 1. Users Profil-Tabelle (erweitert Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Budget Transaktionen
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Sparziele
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  target_date DATE,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Kalender Events
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL,
  reminder_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Rezepte
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  cooking_time INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  image_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Einkaufsliste
CREATE TABLE IF NOT EXISTS public.shopping_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  quantity TEXT,
  checked BOOLEAN DEFAULT FALSE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id ON public.shopping_list(user_id);
```

### 3. Row Level Security (RLS) aktivieren

```sql
-- RLS für alle Tabellen aktivieren
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;

-- Policies für Users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies für Transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies für Savings Goals
CREATE POLICY "Users can view own savings goals" ON public.savings_goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own savings goals" ON public.savings_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals" ON public.savings_goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals" ON public.savings_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Policies für Events
CREATE POLICY "Users can view own events" ON public.events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events" ON public.events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events" ON public.events
  FOR DELETE USING (auth.uid() = user_id);

-- Policies für Recipes
CREATE POLICY "Users can view own recipes" ON public.recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON public.recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON public.recipes
  FOR DELETE USING (auth.uid() = user_id);

-- Policies für Shopping List
CREATE POLICY "Users can view own shopping list" ON public.shopping_list
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own shopping list items" ON public.shopping_list
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping list items" ON public.shopping_list
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping list items" ON public.shopping_list
  FOR DELETE USING (auth.uid() = user_id);
```

### 4. Supabase Credentials holen

1. Gehe zu **Settings** → **API**
2. Kopiere folgende Werte:
   - **Project URL** (z.B. `https://xxxxx.supabase.co`)
   - **anon/public key** (langer String)

### 5. .env Datei erstellen

Erstelle eine `.env` Datei im Projekt-Root:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key-hier
```

⚠️ **Wichtig**: `.env` ist bereits in `.gitignore` - committe diese Datei NICHT!

---

## App lokal starten

### 1. Dependencies installieren

```bash
cd standby-app
npm install
```

### 2. App starten

```bash
# Development Server starten
npm start
```

Du siehst jetzt den **Expo QR Code** im Terminal.

### 3. App auf deinem Gerät öffnen

#### Option A: Expo Go App (Empfohlen für schnelles Testing)

**iOS:**
1. Installiere [Expo Go](https://apps.apple.com/de/app/expo-go/id982107779) aus dem App Store
2. Öffne die Kamera-App
3. Scanne den QR Code aus dem Terminal
4. App öffnet sich in Expo Go

**Android:**
1. Installiere [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) aus dem Play Store
2. Öffne Expo Go App
3. Tippe auf "Scan QR Code"
4. Scanne den QR Code aus dem Terminal

#### Option B: iOS Simulator (nur macOS)

```bash
npm run ios
```

#### Option C: Android Emulator

```bash
npm run android
```

---

## Testbenutzer erstellen

### Methode 1: Via App (Empfohlen)

1. Öffne die App
2. Klicke auf "Registrieren"
3. Fülle das Formular aus:
   - **Name**: Test User 1
   - **Email**: test1@example.com
   - **Passwort**: Test1234!
4. Klicke auf "Registrieren"
5. Du wirst automatisch eingeloggt

### Methode 2: Via Supabase Dashboard

1. Gehe zu **Authentication** → **Users**
2. Klicke auf "Add user"
3. Wähle "Create new user"
   - **Email**: test2@example.com
   - **Password**: Test1234!
   - **Auto Confirm User**: ✅ Aktivieren
4. Klicke auf "Create user"

### Methode 3: Mehrere Testbenutzer gleichzeitig

```bash
# SQL im Supabase SQL Editor ausführen
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES
  ('alice@test.com', crypt('Test1234!', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('bob@test.com', crypt('Test1234!', gen_salt('bf')), NOW(), NOW(), NOW()),
  ('charlie@test.com', crypt('Test1234!', gen_salt('bf')), NOW(), NOW(), NOW())
RETURNING id, email;

-- Dann für jeden User ein Profil erstellen
INSERT INTO public.users (id, email, name)
SELECT id, email, SPLIT_PART(email, '@', 1) AS name
FROM auth.users
WHERE email LIKE '%@test.com';
```

---

## UI/UX Testing

### 1. Authentifizierung testen

**Test-Szenarien:**

✅ **Registrierung**
- [ ] Neuer Benutzer kann sich registrieren
- [ ] Validierung funktioniert (schwaches Passwort wird abgelehnt)
- [ ] Nach Registrierung automatisch eingeloggt
- [ ] Profilname wird korrekt gespeichert

✅ **Login**
- [ ] Login mit korrekten Credentials funktioniert
- [ ] Login mit falschen Credentials zeigt Fehlermeldung
- [ ] "Passwort vergessen" leitet zur Reset-Seite

✅ **Logout**
- [ ] Logout funktioniert
- [ ] Nach Logout wird Auth-Screen angezeigt

### 2. Budget Management testen

**Transaktion hinzufügen:**
1. Gehe zum Budget-Tab
2. Tippe auf "+ Einnahme"
3. Füge Transaktion hinzu:
   - Betrag: 1500€
   - Beschreibung: Gehalt
   - Kategorie: Gehalt
4. Prüfe: Transaktion erscheint in der Liste
5. Prüfe: Saldo wird korrekt aktualisiert

**Ausgabe hinzufügen:**
1. Tippe auf "+ Ausgabe"
2. Füge aus:
   - Betrag: 50€
   - Beschreibung: Einkaufen
   - Kategorie: Essen & Trinken
3. Prüfe: Saldo verringert sich

**Transaktion bearbeiten:**
1. Tippe auf eine Transaktion
2. Klicke auf "Bearbeiten"
3. Ändere Betrag
4. Speichere
5. Prüfe: Änderungen werden übernommen

**Statistiken:**
1. Gehe zu "Statistiken"
2. Prüfe: Diagramme werden korrekt angezeigt
3. Prüfe: Kategorien-Verteilung ist korrekt

### 3. Kalender testen

**Event erstellen:**
1. Gehe zum Kalender-Tab
2. Tippe auf "+"
3. Erstelle Event:
   - Titel: Zahnarzt-Termin
   - Datum/Uhrzeit: Morgen 10:00
   - Kategorie: Gesundheit
   - Erinnerung: 30 Minuten vorher
4. Prüfe: Event erscheint im Kalender

**Event bearbeiten/löschen:**
1. Tippe auf Event
2. Bearbeite Details
3. Oder lösche Event
4. Prüfe: Änderungen werden gespeichert

### 4. Rezepte testen

**Rezept ansehen:**
1. Gehe zum Rezepte-Tab
2. Browse durch vorhandene Rezepte
3. Tippe auf ein Rezept
4. Prüfe: Details werden angezeigt

**Favoriten:**
1. Tippe auf Herz-Symbol
2. Prüfe: Rezept wird als Favorit markiert

**Einkaufsliste:**
1. Füge Zutaten zur Einkaufsliste hinzu
2. Gehe zur Einkaufsliste
3. Hake Artikel ab
4. Prüfe: Status wird gespeichert

### 5. Einstellungen testen

**Profil bearbeiten:**
1. Gehe zu Einstellungen
2. Tippe auf "Profil bearbeiten"
3. Ändere Name
4. Speichere
5. Prüfe: Name wird überall aktualisiert

**Passwort ändern:**
1. Gehe zu "Passwort ändern"
2. Gib altes + neues Passwort ein
3. Speichere
4. Logge aus und mit neuem Passwort wieder ein

**Theme wechseln:**
1. Gehe zu "Aussehen"
2. Wähle "Dunkel"
3. Prüfe: App wechselt zu Dark Mode
4. Wähle "System"
5. Prüfe: Theme folgt System-Einstellungen

**Hilfe & FAQ:**
1. Gehe zu "Hilfe & FAQ"
2. Browse durch Kategorien
3. Öffne verschiedene Fragen
4. Prüfe: Antworten sind hilfreich

### 6. Pull-to-Refresh testen

**In jedem Screen:**
1. Budget-Overview: Ziehe nach unten
2. Kalender: Ziehe nach unten
3. Rezepte: Ziehe nach unten
4. Prüfe: Daten werden neu geladen

---

## Backend Testing

### 1. Datenbank-Verbindung testen

**Test in Supabase Dashboard:**

```sql
-- Prüfe ob User-Profile existieren
SELECT * FROM public.users LIMIT 10;

-- Prüfe Transaktionen
SELECT
  t.id,
  u.name AS user_name,
  t.type,
  t.amount,
  t.description,
  t.date
FROM public.transactions t
JOIN public.users u ON t.user_id = u.id
ORDER BY t.date DESC
LIMIT 20;

-- Prüfe Events
SELECT
  e.id,
  u.name AS user_name,
  e.title,
  e.date,
  e.category
FROM public.events e
JOIN public.users u ON e.user_id = u.id
ORDER BY e.date DESC;
```

### 2. Row Level Security (RLS) testen

**Test-Szenario:**

1. Logge dich als User A ein
2. Erstelle Transaktionen
3. Logge dich als User B ein
4. Prüfe: User B sieht NICHT die Daten von User A
5. Prüfe: User B kann eigene Daten erstellen

**Überprüfung im Supabase Dashboard:**

```sql
-- Zeige nur Daten des aktuellen Users (simuliert RLS)
SELECT * FROM public.transactions
WHERE user_id = 'user-uuid-hier';

-- Sollte leer sein, wenn falscher User
SELECT * FROM public.transactions
WHERE user_id = 'anderer-user-uuid';
```

### 3. API Performance testen

**Network Tab in Browser DevTools:**

1. Öffne Expo DevTools (drücke `d` im Terminal)
2. Öffne Browser DevTools (F12)
3. Gehe zu Network Tab
4. Lade Daten in der App
5. Prüfe: Response Times < 500ms

**Typische Response Times:**
- Login: < 1s
- Transaktionen laden: < 300ms
- Events laden: < 300ms
- Rezepte laden: < 500ms

### 4. Fehlerbehandlung testen

**Test ohne Internet:**
1. Aktiviere Flugmodus
2. Öffne App
3. Prüfe: Fehlermeldung wird angezeigt
4. Prüfe: App stürzt nicht ab
5. Deaktiviere Flugmodus
6. Prüfe: App lädt Daten nach

**Test mit langsamer Verbindung:**
1. Simuliere 3G (in DevTools möglich)
2. Prüfe: Loading States werden angezeigt
3. Prüfe: Keine Timeouts

---

## Testen auf echten Geräten

### iOS Testing (benötigt macOS + Xcode)

#### Option 1: Development Build

```bash
# 1. EAS Build erstellen
eas build --profile development --platform ios

# 2. Warte auf Build (10-15 Minuten)
# 3. Lade .ipa Datei herunter

# 4. Installiere auf Device via Xcode
# Devices & Simulators → Drag & Drop .ipa
```

#### Option 2: TestFlight (für externe Tester)

```bash
# 1. Production Build erstellen
eas build --profile production --platform ios

# 2. Submit zu TestFlight
eas submit --platform ios

# 3. In App Store Connect:
#    - Gehe zu TestFlight
#    - Füge externe Tester hinzu
#    - Sende Einladungen
```

### Android Testing

#### Option 1: APK direkt installieren

```bash
# 1. Development Build erstellen
eas build --profile development --platform android

# 2. Lade .apk herunter
# 3. Sende APK an Tester
# 4. Installiere auf Android Device:
#    - Aktiviere "Unbekannte Quellen"
#    - Öffne APK Datei
#    - Installiere
```

#### Option 2: Google Play Internal Testing

```bash
# 1. Production Build
eas build --profile production --platform android

# 2. Submit zu Google Play
eas submit --platform android

# 3. In Google Play Console:
#    - Gehe zu Internal Testing
#    - Lade AAB hoch
#    - Erstelle Release
#    - Füge Tester-Email-Adressen hinzu
```

---

## Beta Testing

### Test-Nutzer rekrutieren

**Wo finde ich Tester?**
- Freunde & Familie
- Uni-Kommilitonen
- Reddit (r/alphaandbetausers)
- Facebook-Gruppen
- Discord Communities

### Feedback sammeln

**Google Forms Fragebogen erstellen:**

```
📝 StandBy App - Beta Testing Feedback

1. Wie oft nutzt du die App?
   - Täglich
   - Mehrmals pro Woche
   - Selten

2. Welche Features nutzt du am meisten?
   - Budget Management
   - Rezepte
   - Kalender

3. Hast du Bugs gefunden?
   - Ja (beschreibe bitte)
   - Nein

4. Was gefällt dir gut?
   [Freitext]

5. Was könnte verbessert werden?
   [Freitext]

6. Bewertung (1-5 Sterne)
   ⭐⭐⭐⭐⭐
```

### Analytics einbauen (optional)

```bash
# Expo Analytics
npm install expo-analytics

# Oder: Firebase Analytics
npm install @react-native-firebase/analytics
```

---

## Troubleshooting

### Problem: "Unable to connect to Supabase"

**Lösung:**
1. Prüfe `.env` Datei
2. Starte Dev Server neu: `npm start --reset-cache`
3. Prüfe Supabase Project ist online
4. Prüfe API Keys sind korrekt

### Problem: "RLS Policy Error"

**Lösung:**
```sql
-- RLS temporär deaktivieren zum Debuggen
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;

-- Daten manuell prüfen
SELECT * FROM public.transactions;

-- RLS wieder aktivieren
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
```

### Problem: "Expo Go doesn't support..."

**Lösung:**
Erstelle einen Development Build:
```bash
eas build --profile development --platform ios/android
```

### Problem: "Build failed"

**Lösung:**
```bash
# Cache leeren
npm cache clean --force
rm -rf node_modules
npm install

# Expo cache leeren
expo start --clear
```

### Problem: "App stürzt beim Start ab"

**Lösung:**
1. Prüfe Logs: `npx react-native log-ios` oder `npx react-native log-android`
2. Prüfe `.env` Variablen sind gesetzt
3. Prüfe keine Syntax-Fehler

---

## 📊 Testing Checkliste

### Vor dem Release

- [ ] Alle Features manuell getestet
- [ ] Auf iOS getestet (echtes Gerät)
- [ ] Auf Android getestet (echtes Gerät)
- [ ] Dark Mode funktioniert
- [ ] Pull-to-Refresh funktioniert
- [ ] Offline-Handling funktioniert
- [ ] RLS policies getestet (User Isolation)
- [ ] Performance: Alle Requests < 500ms
- [ ] Keine Console Errors
- [ ] Keine Memory Leaks
- [ ] Min. 5 Beta Tester haben Feedback gegeben
- [ ] Kritische Bugs gefixt

---

## 🎯 Nächste Schritte

Nach erfolgreichem Testing:

1. **Production Build erstellen**
   ```bash
   eas build --platform all
   ```

2. **App Store Submission**
   - iOS: App Store Connect
   - Android: Google Play Console

3. **Marketing vorbereiten**
   - Screenshots erstellen
   - App Store Description schreiben
   - Website/Landing Page

4. **Post-Launch Monitoring**
   - Analytics einbauen
   - Crash Reporting (Sentry)
   - User Feedback sammeln

---

## 📞 Support

Bei Fragen oder Problemen:
- GitHub Issues: [github.com/username/standby-app/issues](https://github.com/username/standby-app/issues)
- Email: kontakt@standby-app.de

**Viel Erfolg beim Testing! 🚀**
