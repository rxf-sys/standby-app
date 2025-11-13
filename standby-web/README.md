# 🌟 StandBy Web

Die Web-Version der **StandBy App** – deine All-in-One-Lösung für ein selbstständiges Leben. Budget verwalten, Rezepte finden, Termine planen – alles an einem Ort.

## 📋 Inhaltsverzeichnis

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Voraussetzungen](#-voraussetzungen)
- [Installation](#-installation)
- [Konfiguration](#-konfiguration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Projektstruktur](#-projektstruktur)
- [Migriert von Mobile](#-migriert-von-mobile)

## ✨ Features

### Aktuell implementiert

- ✅ **Authentifizierung**
  - Login & Registrierung
  - Session-Management mit Supabase
  - Passwort-Reset Funktionalität

- ✅ **Dashboard**
  - Übersicht aller Module
  - Quick Stats
  - Responsive Navigation & Sidebar

- ✅ **Budget-Management**
  - Transaktionen tracken (Einnahmen/Ausgaben)
  - Saldo-Übersicht
  - Kategorie-basierte Organisation

- ✅ **Theme System**
  - Light/Dark Mode
  - System-Präferenz Support
  - Persistente Theme-Einstellungen

- ✅ **UI/UX**
  - Moderne shadcn/ui Komponenten
  - Responsive Design (Mobile, Tablet, Desktop)
  - Toast Notifications
  - Loading States

### Geplant für zukünftige Versionen

- 📱 **Budget** (erweitert)
  - Sparziele-Verwaltung
  - Budget-Limits pro Kategorie
  - Statistiken & Charts (Recharts)
  - Export-Funktionen (CSV/PDF)

- 🍳 **Rezepte**
  - 300+ Rezepte-Bibliothek
  - Filter (Diät, Preis, Zeit, Schwierigkeit)
  - Favoriten-System
  - Einkaufsliste
  - Rezept-Details mit Anleitung

- 📅 **Kalender**
  - Event-Management
  - Kategorien (Uni, Arbeit, Privat)
  - Erinnerungen
  - Recurring Events

- ⚙️ **Einstellungen**
  - Profil-Verwaltung
  - Benachrichtigungs-Präferenzen
  - Daten-Export
  - Account-Management

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15** - App Router mit Server Components
- **React 19** - Neueste React-Features
- **TypeScript 5.7** - Strict Mode für Type-Safety

### Styling & UI
- **Tailwind CSS** - Utility-First CSS Framework
- **shadcn/ui** - High-Quality React Components (Radix UI)
- **Lucide Icons** - Moderne Icon-Bibliothek

### State Management & Data Fetching
- **Zustand** - Lightweight State Management
- **TanStack Query v5** - Server State & Caching
- **React Hook Form** - Formular-Handling

### Backend & Database
- **Supabase** - PostgreSQL Database + Auth + Real-time
  - Row Level Security (RLS)
  - Auto-generated APIs
  - Real-time subscriptions

### Validierung & Utils
- **Zod** - Schema-Validierung
- **date-fns** - Datum-Utilities
- **clsx + tailwind-merge** - Class-Namen Management

### Development Tools
- **ESLint** - Code Linting
- **Prettier** - Code Formatting
- **TypeScript** - Type Checking

## 📦 Voraussetzungen

- **Node.js** >= 18.17.0
- **npm** >= 9.0.0
- **Supabase Account** (kostenlos bei [supabase.com](https://supabase.com))

## 🚀 Installation

### 1. Repository klonen

```bash
# Falls noch nicht geschehen
git clone <your-repo-url>
cd standby-web
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Supabase-Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein neues Projekt
2. Navigiere zu **Settings** → **API**
3. Kopiere:
   - `Project URL`
   - `anon/public` API Key

### 4. Datenbank einrichten

1. Öffne den **SQL Editor** in Supabase
2. Kopiere den Inhalt von `../supabase/schema.sql` (aus dem Mobile-Projekt)
3. Führe das SQL-Skript aus

Das Schema erstellt automatisch:
- Alle Tabellen (users, transactions, budgets, savings_goals, recipes, etc.)
- Row Level Security (RLS) Policies
- Database Triggers
- 300+ Sample Recipes

## ⚙️ Konfiguration

### Environment Variables

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.example .env.local
```

Fülle die Werte aus:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=StandBy
```

## 💻 Development

### Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Weitere Befehle

```bash
# Type-Checking
npm run type-check

# Linting
npm run lint

# Code formatieren
npm run format

# Production Build
npm run build

# Production Server starten
npm run start
```

## 🌐 Deployment

### Vercel (Empfohlen)

1. Push dein Projekt zu GitHub
2. Importiere das Projekt auf [vercel.com](https://vercel.com)
3. Konfiguriere die Environment Variables
4. Deploy!

```bash
# Oder via Vercel CLI
npm install -g vercel
vercel
```

### Andere Plattformen

Das Projekt kann auf jeder Plattform deployed werden, die Next.js unterstützt:
- Netlify
- Railway
- Render
- AWS Amplify
- Cloudflare Pages

## 📁 Projektstruktur

```
standby-web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth Route Group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # Protected Dashboard Routes
│   │   │   ├── budget/
│   │   │   ├── recipes/
│   │   │   ├── calendar/
│   │   │   └── settings/
│   │   ├── layout.tsx           # Root Layout
│   │   ├── page.tsx             # Landing Page
│   │   └── globals.css          # Global Styles
│   │
│   ├── components/              # React Components
│   │   ├── ui/                  # shadcn/ui Base Components
│   │   ├── auth/                # Auth Components (AuthGuard)
│   │   ├── layout/              # Layout Components (Header, Sidebar)
│   │   ├── budget/              # Budget-spezifische Components
│   │   ├── recipes/             # Recipe-spezifische Components
│   │   ├── calendar/            # Calendar-spezifische Components
│   │   └── providers/           # Context Providers
│   │
│   └── lib/                     # Core Logic
│       ├── services/            # API Services (Supabase)
│       │   ├── supabase.ts
│       │   ├── auth.service.ts
│       │   └── budget.service.ts
│       ├── hooks/               # Custom React Hooks
│       │   └── use-toast.ts
│       ├── store/               # Zustand Stores
│       │   ├── auth.store.ts
│       │   ├── budget.store.ts
│       │   └── theme.store.ts
│       ├── types/               # TypeScript Types
│       │   ├── user.ts
│       │   ├── budget.ts
│       │   ├── recipe.ts
│       │   └── calendar.ts
│       └── utils.ts             # Utility Functions
│
├── public/                      # Static Assets
├── .env.example                 # Environment Variables Template
├── .eslintrc.json              # ESLint Configuration
├── .prettierrc                 # Prettier Configuration
├── next.config.js              # Next.js Configuration
├── tailwind.config.ts          # Tailwind Configuration
├── tsconfig.json               # TypeScript Configuration
├── package.json
└── README.md
```

## 🔄 Migriert von Mobile

Diese Web-Version wurde aus der React Native Mobile-App portiert. Folgendes wurde übernommen:

### Direkt übernommen
- ✅ **Types** - Alle TypeScript-Definitionen
- ✅ **Services** - Supabase-API-Layer (angepasst für Web)
- ✅ **Stores** - Zustand State Management
- ✅ **Utils** - Utility-Funktionen
- ✅ **Business Logic** - Komplette App-Logik

### Angepasst für Web
- 🔄 **Navigation** - React Navigation → Next.js App Router
- 🔄 **Styling** - React Native Paper → shadcn/ui + Tailwind
- 🔄 **Storage** - AsyncStorage → LocalStorage/Cookies
- 🔄 **Charts** - Victory Native → Recharts (geplant)

### Web-spezifische Verbesserungen
- ✨ Server-Side Rendering (SSR)
- ✨ SEO-Optimierung
- ✨ Bessere Performance
- ✨ Responsive Design für alle Bildschirmgrößen

## 🧪 Testing

```bash
# Tests ausführen (wenn implementiert)
npm test

# Mit Coverage
npm run test:coverage
```

## 🤝 Contributing

1. Fork das Projekt
2. Erstelle einen Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📝 Lizenz

Dieses Projekt ist privat und für den persönlichen Gebrauch bestimmt.

## 🆘 Support & Hilfe

Bei Fragen oder Problemen:
1. Prüfe die [Supabase Dokumentation](https://supabase.com/docs)
2. Prüfe die [Next.js Dokumentation](https://nextjs.org/docs)
3. Erstelle ein Issue im Repository

## 🎯 Roadmap

### Phase 1: Core Features (✅ Abgeschlossen)
- [x] Authentifizierung
- [x] Dashboard
- [x] Budget-Übersicht
- [x] Theme System

### Phase 2: Budget-Modul (🚧 In Arbeit)
- [ ] Transaktionen hinzufügen/bearbeiten
- [ ] Sparziele-Management
- [ ] Statistiken mit Charts
- [ ] Budget-Limits

### Phase 3: Rezepte-Modul
- [ ] Rezepte-Browser
- [ ] Filter & Suche
- [ ] Favoriten
- [ ] Einkaufsliste

### Phase 4: Kalender-Modul
- [ ] Event-Management
- [ ] Kalender-Ansichten
- [ ] Erinnerungen
- [ ] Recurring Events

### Phase 5: Polish & Optimierung
- [ ] Performance-Optimierung
- [ ] Tests
- [ ] PWA-Support
- [ ] Analytics

---

**Erstellt mit ❤️ für ein selbstständiges Leben**
