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

- 💰 **Budgetplaner** - Behalte deine Finanzen im Griff
  - Einnahmen & Ausgaben tracken
  - Kategorisierung & Budget-Limits
  - Visualisierungen & Statistiken
  - Sparziele definieren

- 🍳 **Rezeptvorschläge** - Günstig, einfach, lecker
  - 300+ Rezepte speziell für junge Menschen
  - Filter nach Budget, Zeit & Ernährung
  - Einkaufsliste mit einem Tap
  - "Was kann ich kochen?" Funktion

- 📅 **Terminkalender** - Organisation leicht gemacht
  - Termine erstellen & verwalten
  - Kategorien (Uni, Arbeit, Privat)
  - Multi-Device Synchronisation
  - Erinnerungen & Benachrichtigungen

- 🔄 **Offline-First** - Funktioniert auch ohne Internet
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
```bash
# Repository klonen
git clone https://github.com/username/standby-app.git
cd standby-app

# Dependencies installieren
npm install

# Environment Variables einrichten
cp .env.example .env.development
# Füge deine Supabase Keys in .env.development ein

# App starten
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

- **Frontend:** React Native + Expo
- **Backend:** Supabase (PostgreSQL)
- **State Management:** Zustand
- **Data Fetching:** TanStack Query
- **Offline Support:** WatermelonDB
- **UI Library:** React Native Paper
- **Charts:** Victory Native
- **Testing:** Jest + React Native Testing Library

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