# Contributing zu StandBy

Vielen Dank für dein Interesse, zu StandBy beizutragen! 🎉

## 📋 Code of Conduct

Bitte lies und befolge unseren [Code of Conduct](CODE_OF_CONDUCT.md).

## 🚀 Wie kann ich beitragen?

### Bugs melden

Bevor du einen Bug meldest:
- Stelle sicher, dass er noch nicht gemeldet wurde
- Sammle so viele Details wie möglich
- Nutze unser [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md)

### Features vorschlagen

- Nutze unser [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md)
- Erkläre, warum das Feature nützlich wäre
- Gib konkrete Anwendungsfälle an

### Pull Requests

1. **Fork & Clone**
```bash
   git clone https://github.com/username/standby-app.git
   cd standby-app
```

2. **Branch erstellen**
```bash
   git checkout -b feature/deine-feature-beschreibung
```

3. **Development Setup**
```bash
   npm install
   cp .env.example .env.development
   npm start
```

4. **Code schreiben**
   - Folge unseren Code Style Guidelines
   - Schreibe Tests für neue Features
   - Aktualisiere Dokumentation

5. **Testen**
```bash
   npm run lint
   npm run type-check
   npm test
```

6. **Commit**
```bash
   git commit -m "feat: beschreibe deine Änderung"
```
   
   Nutze [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` Neues Feature
   - `fix:` Bug Fix
   - `docs:` Dokumentation
   - `style:` Formatierung
   - `refactor:` Code Refactoring
   - `test:` Tests hinzufügen
   - `chore:` Wartung

7. **Push & Pull Request**
```bash
   git push origin feature/deine-feature-beschreibung
```
   
   Öffne einen Pull Request mit:
   - Klarer Beschreibung der Änderungen
   - Screenshots bei UI-Änderungen
   - Referenz zu related Issues

## 💻 Development Guidelines

### Code Style

Wir nutzen ESLint und Prettier:
```bash
npm run lint:fix
npm run format
```

### TypeScript

- Nutze strikte TypeScript types
- Vermeide `any` wann immer möglich
- Dokumentiere komplexe Types

### Testing

- Schreibe Unit Tests für Utils und Services
- Component Tests für UI-Komponenten
- E2E Tests für kritische User Flows

**Ziel: >80% Code Coverage**

### Commits

- Kleine, fokussierte Commits
- Aussagekräftige Commit-Messages
- Ein Commit pro logischer Änderung

### Pull Requests

- Halte PRs klein und fokussiert
- Ein Feature/Fix pro PR
- Verlinke related Issues
- Beantworte Review-Kommentare zeitnah

## 📁 Projekt-Struktur