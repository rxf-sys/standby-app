# 🚀 Deployment Guide - StandBy Web

Dieser Guide zeigt dir, wie du die StandBy Web-App produktiv schaltest.

## 📋 Inhaltsverzeichnis

- [Voraussetzungen](#voraussetzungen)
- [Supabase Setup](#supabase-setup)
- [Deployment auf Vercel](#deployment-auf-vercel-empfohlen)
- [Alternative Deployment-Optionen](#alternative-deployment-optionen)
- [Custom Domain](#custom-domain-einrichten)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Voraussetzungen

- ✅ Supabase-Account
- ✅ GitHub-Account
- ✅ Git installiert
- ✅ Node.js >= 18.17.0

## Supabase Setup

### 1. Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com)
2. Klicke auf **"New Project"**
3. Wähle:
   - **Organization**: Deine Organisation
   - **Name**: `standby-production` (oder beliebig)
   - **Database Password**: Sicheres Passwort (gut aufbewahren!)
   - **Region**: `Europe (Frankfurt)` für deutsche Nutzer
   - **Pricing Plan**: Free (für bis zu 500MB DB & 2GB Storage)

### 2. Datenbank-Schema einrichten

1. Navigiere zu **SQL Editor** in der Sidebar
2. Klicke auf **New Query**
3. Öffne die Datei `../supabase/schema.sql` aus dem Mobile-Projekt
4. Kopiere den gesamten Inhalt
5. Füge ihn in den SQL Editor ein
6. Klicke auf **Run**

Das Schema erstellt:
- ✅ Alle Tabellen (users, transactions, budgets, recipes, etc.)
- ✅ Row Level Security Policies
- ✅ Database Triggers
- ✅ 300+ Sample Recipes

### 3. API Keys kopieren

1. Gehe zu **Settings** → **API**
2. Kopiere:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public Key**: `eyJhbG...` (langer String)

## Deployment auf Vercel (Empfohlen)

### Warum Vercel?

- ✅ Kostenlos für persönliche Projekte
- ✅ Automatische Deployments bei Git-Push
- ✅ Global CDN
- ✅ Perfekt für Next.js optimiert
- ✅ HTTPS automatisch
- ✅ Preview-Deployments für Branches

### Schritt-für-Schritt

#### 1. Repository erstellen

```bash
# Initialisiere Git (falls noch nicht geschehen)
cd standby-web
git init
git add .
git commit -m "Initial commit: StandBy Web"

# Erstelle ein neues GitHub Repository
# Gehe zu https://github.com/new

# Füge Remote hinzu und pushe
git remote add origin https://github.com/DEIN-USERNAME/standby-web.git
git branch -M main
git push -u origin main
```

#### 2. Vercel-Projekt erstellen

**Option A: Via Website (einfacher)**

1. Gehe zu [vercel.com](https://vercel.com)
2. Klicke auf **"Add New"** → **"Project"**
3. Importiere dein GitHub-Repository
4. Konfiguriere:
   - **Framework Preset**: Next.js (wird automatisch erkannt)
   - **Root Directory**: `./` (oder `./standby-web` falls im Monorepo)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

**Option B: Via CLI**

```bash
# Vercel CLI installieren
npm install -g vercel

# Login
vercel login

# Projekt deployen
vercel

# Folge den Prompts:
# - Set up and deploy? Yes
# - Which scope? <dein-account>
# - Link to existing project? No
# - Project name? standby-web
# - Directory? ./
# - Override settings? No
```

#### 3. Environment Variables konfigurieren

Im Vercel Dashboard:

1. Gehe zu **Settings** → **Environment Variables**
2. Füge hinzu:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://deine-domain.vercel.app` | Production |
| `NEXT_PUBLIC_APP_NAME` | `StandBy` | Production, Preview, Development |

**Via CLI:**

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Eingabe: https://xxxxx.supabase.co
# Environments: Production, Preview, Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Eingabe: eyJhbG...
# Environments: Production, Preview, Development
```

#### 4. Re-Deploy mit Environment Variables

```bash
# Via CLI
vercel --prod

# Oder: Git Push
git push origin main
# Vercel deployed automatisch
```

#### 5. Deployment verifizieren

1. Öffne die Deployment-URL (z.B. `https://standby-web.vercel.app`)
2. Teste:
   - ✅ Landing Page lädt
   - ✅ Registrierung funktioniert
   - ✅ Login funktioniert
   - ✅ Dashboard ist erreichbar
   - ✅ Theme-Switch funktioniert

## Alternative Deployment-Optionen

### Netlify

```bash
# Netlify CLI installieren
npm install -g netlify-cli

# Login
netlify login

# Init und Deploy
netlify init

# Environment Variables in Netlify Dashboard setzen
# Site settings > Environment variables
```

### Railway

1. Gehe zu [railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Wähle dein Repository
4. Füge Environment Variables hinzu
5. Deploy!

### Docker (Self-Hosted)

```bash
# Dockerfile erstellen
cat > Dockerfile << 'EOF'
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Build & Run
docker build -t standby-web .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... \
  standby-web
```

## Custom Domain einrichten

### Auf Vercel

1. Gehe zu **Settings** → **Domains**
2. Klicke auf **Add Domain**
3. Gib deine Domain ein (z.B. `standby.deinewebsite.de`)
4. Folge den DNS-Konfigurationsanweisungen:

**A-Record:**
```
Type: A
Name: @ (oder subdomain)
Value: 76.76.21.21 (Vercel IP)
```

**CNAME-Record (alternativ):**
```
Type: CNAME
Name: subdomain
Value: cname.vercel-dns.com
```

5. Warte auf DNS-Propagation (5 min - 24 Stunden)
6. Vercel stellt automatisch ein SSL-Zertifikat aus

### Eigene Domain kaufen

**Empfohlene Anbieter:**
- [Namecheap](https://namecheap.com) - ~10€/Jahr
- [Google Domains](https://domains.google) - ~12€/Jahr
- [Cloudflare](https://cloudflare.com) - ~8€/Jahr + kostenlose Features

## Post-Deployment

### 1. Supabase Auth URLs aktualisieren

Im Supabase Dashboard:

1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://deine-production-url.vercel.app`
3. **Redirect URLs**: Füge hinzu:
   ```
   https://deine-production-url.vercel.app/auth/callback
   https://deine-production-url.vercel.app/auth/reset-password
   ```

### 2. E-Mail-Templates anpassen (Optional)

**Authentication** → **Email Templates**

Passe die E-Mail-Templates an:
- Bestätigungs-E-Mail
- Passwort-Reset-E-Mail
- Magic Link

Verwende deine Production-URL in den Links.

### 3. Rate Limits überprüfen

Für Production:
1. **Authentication** → **Rate Limits**
2. Empfohlene Settings:
   - Email signups: 4 per hour
   - SMS signups: 1 per hour per IP
   - Password reset: 4 per hour

### 4. Analytics einrichten (Optional)

**Google Analytics:**

```bash
# In .env.local hinzufügen
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Plausible Analytics (Privacy-friendly):**

```bash
# In layout.tsx hinzufügen
<Script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/script.js"
/>
```

### 5. Error Tracking (Optional)

**Sentry:**

```bash
npm install @sentry/nextjs

# Init
npx @sentry/wizard -i nextjs

# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

## Monitoring & Maintenance

### Vercel Dashboard

Überwache:
- 📊 **Analytics**: Seitenaufrufe, Nutzer
- 🚀 **Deployments**: Status, Logs
- ⚡ **Performance**: Core Web Vitals
- 🐛 **Error Logs**: Runtime-Fehler

### Supabase Dashboard

Überwache:
- 📈 **Database Usage**: Speicher, Connections
- 👥 **Auth Users**: Anzahl, Growth
- 🔐 **API Requests**: Rate Limits
- 💾 **Storage**: File Usage

### Kosten im Blick

**Free Tier Limits (Vercel):**
- ✅ 100GB Bandwidth/Monat
- ✅ Unbegrenzte Deployments
- ✅ 100 GB-Stunden Serverless Functions

**Free Tier Limits (Supabase):**
- ✅ 500MB Datenbank
- ✅ 2GB File Storage
- ✅ 50K MAU (Monthly Active Users)
- ✅ 2GB Bandwidth

**Upgrade notwendig ab:**
- 📈 >50.000 monatliche Nutzer
- 💾 >500MB Daten in DB
- 🔄 >100GB Traffic/Monat

**Kosten nach Upgrade:**
- Vercel Pro: $20/Monat
- Supabase Pro: $25/Monat

## Troubleshooting

### Build schlägt fehl

```bash
# Lokal testen
npm run build

# Common Issues:
# 1. TypeScript-Fehler
npm run type-check

# 2. Linting-Fehler
npm run lint

# 3. Missing dependencies
npm install
```

### Environment Variables funktionieren nicht

```bash
# Checken ob Variablen gesetzt sind
vercel env ls

# Neu ziehen
vercel env pull .env.local
```

### Supabase Connection Fehler

1. Prüfe URLs in `.env.local`
2. Prüfe Supabase-Projekt ist aktiv
3. Prüfe Row Level Security Policies
4. Prüfe API Key (anon/public, nicht service_role!)

### Slow Page Loads

1. Aktiviere Edge Functions in Vercel
2. Optimiere Bilder mit `next/image`
3. Aktiviere Caching in Next.js
4. Nutze ISR (Incremental Static Regeneration)

### CORS Fehler

Supabase-Seite:
1. **Settings** → **API** → **CORS**
2. Füge deine Domain hinzu

---

## 🎉 Fertig!

Deine App ist jetzt live! 🚀

**Nächste Schritte:**
- 📣 Mit Freunden teilen
- 📊 Analytics überprüfen
- 🐛 Feedback sammeln
- ✨ Weitere Features entwickeln

**Support:**
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
