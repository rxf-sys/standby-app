# ⚡ Quick Start Guide

Los geht's in 5 Minuten!

## 1. Dependencies installieren

```bash
cd standby-web
npm install
```

## 2. Supabase einrichten

### a) Projekt erstellen
1. Gehe zu [supabase.com](https://supabase.com)
2. Erstelle ein neues Projekt
3. Wähle Region: **Europe (Frankfurt)**

### b) Schema importieren
1. Öffne **SQL Editor** in Supabase
2. Kopiere den Inhalt von `../supabase/schema.sql`
3. Führe das SQL-Skript aus (klicke **Run**)

### c) API Keys kopieren
1. Gehe zu **Settings** → **API**
2. Kopiere:
   - Project URL
   - anon/public Key

## 3. Environment Variables

```bash
# .env.local erstellen
cp .env.example .env.local

# Fülle die Werte aus:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## 5. Ersten Account erstellen

1. Klicke auf **"Jetzt starten"**
2. Registriere dich mit:
   - Name
   - E-Mail
   - Passwort (min. 8 Zeichen)
3. Bestätige deine E-Mail (checke Spam-Ordner!)
4. Melde dich an
5. Fertig! 🎉

## Nächste Schritte

- 📊 Füge deine erste Transaktion hinzu
- 🎨 Probiere Dark Mode aus
- 📖 Lies das komplette [README.md](./README.md)
- 🚀 Deploye deine App mit [DEPLOYMENT.md](./DEPLOYMENT.md)

## Häufige Probleme

### "Missing Supabase URL"
→ Überprüfe `.env.local`

### Build-Fehler
```bash
npm run type-check
npm run lint
```

### Port 3000 bereits belegt
```bash
PORT=3001 npm run dev
```

---

**Viel Erfolg! 🚀**
