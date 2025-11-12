# 🔧 Troubleshooting: SDK 54 Startup Issues

## Problem: "PlatformConstants could not be found"

Dieser Fehler tritt nach dem SDK-Upgrade auf, weil native Module nicht richtig initialisiert sind.

## ✅ Lösung 1: Cache komplett leeren (EMPFOHLEN)

```bash
# 1. Alle Caches löschen
rm -rf .expo node_modules/.cache .metro

# 2. Metro Bundler mit Reset starten
npm start -- --clear

# 3. In neuem Terminal: Expo Go App schließen und neu öffnen
# 4. QR Code neu scannen
```

## ✅ Lösung 2: Expo Go App aktualisieren

**Das Problem:** Deine Expo Go App ist möglicherweise noch auf einer älteren Version.

### iOS:
1. App Store öffnen
2. Nach "Expo Go" suchen
3. "Update" klicken (falls verfügbar)
4. App muss mindestens Version **2.32.x** oder höher sein (für SDK 54)

### Android:
1. Play Store öffnen
2. Nach "Expo Go" suchen
3. "Update" klicken (falls verfügbar)
4. App muss mindestens Version **2.32.x** oder höher sein (für SDK 54)

## ✅ Lösung 3: Development Build erstellen (für persistente Probleme)

Wenn Expo Go nicht funktioniert, erstelle einen Development Build:

```bash
# iOS Development Build (nur macOS)
npx expo run:ios

# Android Development Build
npx expo run:android
```

**Vorteil:** Enthält alle nativen Module und ist nicht von Expo Go abhängig.

## ✅ Lösung 4: Schritt-für-Schritt Clean Install

```bash
# 1. Alles löschen
rm -rf node_modules .expo .metro package-lock.json

# 2. NPM Cache leeren
npm cache clean --force

# 3. Neu installieren
npm install

# 4. Mit Cache-Reset starten
npm start -- --clear
```

## 🔍 Wenn gar nichts hilft

### Option A: Zurück auf SDK 50 (temporär)

Falls du sofort testen musst und SDK 54 Probleme macht:

```bash
git checkout 70af173  # Commit vor SDK 54 Upgrade
npm install
npm start
```

### Option B: Simulator/Emulator verwenden

Statt Expo Go auf echtem Gerät:

```bash
# iOS Simulator (nur macOS)
npm run ios

# Android Emulator (benötigt Android Studio)
npm run android
```

## 📱 Expo Go Version prüfen

Öffne Expo Go → Settings (⚙️) → Scroll nach unten → "Version"

**Erforderlich für SDK 54:**
- iOS: >= 2.32.0
- Android: >= 2.32.0

Wenn deine Version älter ist, MUSST du updaten!

## 💡 Warum passiert das?

Nach großen SDK-Upgrades (50 → 54) ändern sich:
- React Native Version (0.73 → 0.76)
- Native Module APIs
- TurboModule System
- Hermes JavaScript Engine

Expo Go muss mit dem SDK kompatibel sein, sonst können native Module nicht geladen werden.

## ✨ Erfolgreiches Setup erkennen

Du weißt, dass es funktioniert wenn:
1. ✅ Metro Bundler startet ohne Fehler
2. ✅ "Bundling complete" erscheint
3. ✅ QR Code wird angezeigt
4. ✅ App lädt ohne "PlatformConstants" Fehler
5. ✅ Du siehst den Login-Screen

## 🆘 Weitere Hilfe

Falls der Fehler weiterhin auftritt:
1. Poste die genaue Fehlermeldung
2. Deine Expo Go Version (iOS/Android)
3. Node.js Version: `node --version`
4. NPM Version: `npm --version`

---

**Letzte Aktualisierung:** Nach SDK 54 Upgrade
