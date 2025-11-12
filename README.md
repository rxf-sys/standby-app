# 🏠 StandBy - Dein Begleiter ins selbstständige Leben

<div align="center">
  <img src="./docs/assets/logo.png" alt="StandBy Logo" width="200"/>
  
  [![CI Status](https://github.com/username/standby-app/workflows/CI/badge.svg)](https://github.com/username/standby-app/actions)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](package.json)
</div>

## 🎯 Über StandBy

StandBy ist die erste All-in-One-App, die junge Menschen (16-25 Jahre) beim Übergang in die Selbstständigkeit unterstützt. Mit integriertem Budgetplaner, Rezeptvorschlägen und Terminkalender hast du alles an einem Ort.

### ✨ Features

- 🔐 **Authentifizierung & Profile** - Sicher und personalisiert
  - Benutzerregistrierung und -anmeldung
  - Profilmanagement mit Avatar
  - Passwort-Reset Funktion
  - Sichere Authentifizierung mit Supabase

- 💰 **Budgetplaner** - Behalte deine Finanzen im Griff
  - Einnahmen & Ausgaben tracken
  - Kategorisierung & Budget-Limits
  - Visualisierungen & Statistiken mit Victory Charts
  - Sparziele definieren und verfolgen
  - Detaillierte Statistiken mit:
    - Monatliche Trendanalyse (6 Monate)
    - Ausgaben nach Kategorien (Pie Chart)
    - Top Ausgabenkategorien (Bar Chart)
    - Sparquote mit visueller Darstellung
    - Monatliche Übersicht mit Einnahmen, Ausgaben und Bilanz

- 🍳 **Rezeptvorschläge** - Günstig, einfach, lecker
  - 300+ Rezepte speziell für junge Menschen
  - Filter nach Budget, Zeit & Ernährung
  - Interaktive Einkaufsliste mit Checkbox-Funktion
  - "Was kann ich kochen?" Funktion
  - Favoriten-Management
  - Schwierigkeitsgrade (Einfach, Mittel, Schwer)

- 📅 **Terminkalender** - Organisation leicht gemacht
  - Termine erstellen & verwalten
  - Kategorien (Uni, Arbeit, Privat)
  - Multi-Device Synchronisation
  - Erinnerungen & Benachrichtigungen

- ⚙️ **Einstellungen & Anpassungen**
  - Profilbearbeitung
  - Passwort ändern
  - App-Einstellungen (Benachrichtigungen, Theme, Sprache)
  - Logout-Funktion

- 🌓 **Dark Mode** - Vollständig integriert
  - Hell-Modus für tagsüber
  - Dunkel-Modus für abends
  - System-Theme (folgt Geräteeinstellungen)
  - Automatischer Wechsel bei System-Theme

- 📖 **Hilfe & FAQ** - Umfassende Unterstützung
  - 12+ häufig gestellte Fragen
  - Kategorisiert nach Themen (Budget, Rezepte, Kalender, Account)
  - Kontaktmöglichkeit für weitere Fragen

- 🔄 **Offline-First** - Funktioniert auch ohne Internet (geplant mit WatermelonDB)
- 🔐 **Datenschutz** - DSGVO-konform, EU-Server
- 🎨 **Modern & Intuitiv** - Für Digital Natives gemacht

## 🚀 Quick Start

### Voraussetzungen

- Node.js 20+ ([Download](https://nodejs.org/))
- npm oder yarn
- Expo CLI (`npm install -g expo-cli`)
- Für iOS: macOS mit Xcode
- Für Android: Android Studio

### Installation

#### 1. Repository Setup
```bash
# Repository klonen
git clone https://github.com/username/standby-app.git
cd standby-app

# Dependencies installieren
npm install --legacy-peer-deps
```

#### 2. Supabase Setup

1. Erstelle ein kostenloses Supabase-Projekt auf [supabase.com](https://supabase.com)
2. Gehe zu **Project Settings** → **API** und kopiere:
   - Project URL
   - anon/public key
3. Erstelle `.env.development` Datei:
```bash
cp .env.example .env.development
```
4. Füge deine Supabase-Credentials in `.env.development` ein:
```env
EXPO_PUBLIC_SUPABASE_URL=https://dein-projekt-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key-hier
```
5. Führe das Datenbank-Schema aus:
   - Öffne den **SQL Editor** in Supabase
   - Kopiere den Inhalt von `supabase/schema.sql`
   - Führe das Script aus (▶ Button)

6. Aktiviere Email-Authentifizierung:
   - Gehe zu **Authentication** → **Providers**
   - Aktiviere **Email**
   - Optional: Passe Email-Templates an unter **Authentication** → **Email Templates**

#### 3. App starten
```bash
# Development Server starten
npm start
```

### In Entwicklungsumgebung öffnen
```bash
# iOS Simulator (nur macOS)
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## 📱 Screenshots

<div align="center">
  <img src="./docs/assets/screenshot-budget.png" width="250"/>
  <img src="./docs/assets/screenshot-recipes.png" width="250"/>
  <img src="./docs/assets/screenshot-calendar.png" width="250"/>
</div>

## 🏗️ Tech Stack

- **Frontend:** React Native + Expo (~50.0.0)
- **Language:** TypeScript (strict mode)
- **Backend:** Supabase (PostgreSQL mit Row Level Security)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query v5) mit Caching & Optimistic Updates
- **Navigation:** React Navigation v6 (Bottom Tabs + Native Stack)
- **Offline Support:** WatermelonDB (geplant)
- **UI Library:** React Native Paper + Lucide Icons
- **Charts:** Victory Native (Line, Pie, Bar Charts)
- **Date Handling:** date-fns v3
- **Validation:** Zod Schemas
- **Testing:** Jest + React Native Testing Library

## 📂 Projektstruktur

```
src/
├── components/          # Wiederverwendbare UI-Komponenten
│   ├── common/         # Generische Komponenten (Button, Card, Badge, etc.)
│   ├── budget/         # Budget-spezifische Komponenten
│   ├── recipes/        # Rezept-spezifische Komponenten
│   └── calendar/       # Kalender-spezifische Komponenten
├── screens/            # App-Bildschirme
│   ├── auth/          # Authentifizierung (Login, Register)
│   ├── budget/        # Budget-Screens (Overview, Transactions, Statistics)
│   ├── recipes/       # Rezept-Screens (List, Details, Shopping List)
│   ├── calendar/      # Kalender-Screens
│   └── settings/      # Einstellungen & Profil
├── navigation/         # React Navigation Setup
│   ├── types.ts       # Navigation Type Definitions
│   ├── RootNavigator.tsx
│   └── BottomTabNavigator.tsx
├── services/          # API & Backend Services
│   ├── supabase.ts    # Supabase Client
│   ├── authService.ts # Authentifizierung
│   ├── budgetService.ts
│   └── recipeService.ts
├── store/             # Zustand State Management
│   ├── authStore.ts
│   ├── budgetStore.ts
│   └── recipeStore.ts
├── hooks/             # Custom React Hooks (React Query)
│   ├── useAuth.ts
│   ├── useBudget.ts
│   └── useRecipes.ts
├── utils/             # Utility Funktionen
│   ├── currency.ts    # Währungsformatierung
│   ├── date.ts        # Datums-Utilities
│   ├── validation.ts  # Zod Validation Schemas
│   ├── statistics.ts  # Finanzstatistiken
│   └── storage.ts     # AsyncStorage Wrapper
├── types/             # TypeScript Type Definitions
│   ├── budget.ts
│   ├── recipe.ts
│   ├── calendar.ts
│   └── user.ts
└── theme/             # Theme System (Farben, Spacing, Typography)
    ├── colors.ts
    ├── spacing.ts
    └── typography.ts
```

## 📚 Dokumentation

- [📖 API Dokumentation](./docs/API.md)
- [🗄️ Datenbank Schema](./docs/DATABASE.md)
- [🏛️ Architektur](./docs/ARCHITECTURE.md)
- [🚀 Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

Wir freuen uns über Beiträge! Bitte lies unsere [Contributing Guidelines](CONTRIBUTING.md) für Details.

### Development Workflow

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 🧪 Testing
```bash
# Unit Tests
npm test

# Tests im Watch Mode
npm run test:watch

# Coverage Report
npm run test:coverage

# E2E Tests
npm run test:e2e
```

## 📦 Build & Deployment
```bash
# iOS Build
npm run build:ios

# Android Build
npm run build:android

# App Store Submission
npm run submit:ios

# Google Play Submission
npm run submit:android
```

## 🐛 Bug Reports & Feature Requests

Bitte nutze unsere [Issue Templates](https://github.com/username/standby-app/issues/new/choose):
- [🐛 Bug Report](https://github.com/username/standby-app/issues/new?template=bug_report.md)
- [✨ Feature Request](https://github.com/username/standby-app/issues/new?template=feature_request.md)

## 📊 Projektstatus

### ✅ Fertiggestellt (~99%)

**Core Features:**
- ✅ Authentifizierung (Login, Register, Passwort zurücksetzen)
- ✅ Budget Management (Transaktionen CRUD, Kategorien, Statistiken)
- ✅ Kalender (Events CRUD, Kategorien, Erinnerungen)
- ✅ Rezepte (Liste, Details, Favoriten, Einkaufsliste)
- ✅ Einstellungen (Profil, Passwort, Theme, Benachrichtigungen)
- ✅ Supabase Backend Integration (Auth, Datenbank, RLS)
- ✅ Pull-to-Refresh auf allen Hauptscreens
- ✅ TypeScript Strict Mode (100% typisiert)
- ✅ React Query für Data Fetching & Caching
- ✅ Zustand für State Management
- ✅ Victory Charts für Finanzstatistiken
- ✅ Dark Mode (Hell, Dunkel, System-Theme)
- ✅ Hilfe & FAQ Sektion mit 12+ Fragen

**Bereit für Produktion:**
- Vollständige CRUD-Operationen für alle Entitäten
- Echte User-Authentifizierung mit Supabase
- Row Level Security (RLS) auf Datenbank
- Responsive & moderne UI mit Dark Mode Support
- Fehlerbehandlung & Loading States
- Offline-First vorbereitet (Store & Hooks)
- Umfassendes Hilfe-System für Nutzer

### 🔄 In Entwicklung

- 📱 Push Notifications (Infrastructure vorbereitet)
- 📷 Profilbild Upload (Kamera & Galerie)

### 🎯 Geplant

- 🔄 Offline-Synchronisation mit WatermelonDB
- 📊 Erweiterte Budget-Analysen & Prognosen
- 🤖 KI-basierte Rezeptvorschläge
- 🔗 Teilen-Funktionalität für Rezepte
- 🌍 Mehrsprachigkeit (EN, DE)
- 📧 Email-Benachrichtigungen
- 💳 Export-Funktionen (PDF, CSV)

## 📄 License

Dieses Projekt ist unter der MIT License lizenziert - siehe [LICENSE](LICENSE) für Details.

## 👥 Team

- **Dein Name** - *Creator & Lead Developer* - [@username](https://github.com/username)

## 🙏 Danksagungen

- Alle Contributors die geholfen haben
- [Supabase](https://supabase.com) für das großartige Backend
- [Expo](https://expo.dev) für die Developer Experience

## 📞 Kontakt

- Website: [standby-app.com](https://standby-app.com)
- Email: kontakt@standby-app.de
- Twitter: [@StandByApp](https://twitter.com/standbyapp)

---

<div align="center">
  Made with ❤️ for young people starting their independent life
</div>