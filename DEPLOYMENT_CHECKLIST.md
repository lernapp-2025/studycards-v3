# StudyCards Deployment Checklist

## ✅ Phase 1: Lokales Setup

### 1. Supabase Setup
- [ ] Supabase Account erstellt
- [ ] Projekt "studycards-production" erstellt
- [ ] Region: Europe (eu-central-1) 
- [ ] Datenbank-Migration ausgeführt
- [ ] API Keys notiert:
  - [ ] Project URL: ________________
  - [ ] Anon Key: ________________
  - [ ] Service Role Key: ________________

### 2. Umgebungsvariablen (.env.local)
- [ ] .env.local Datei erstellt
- [ ] Supabase Variablen eingetragen
- [ ] Stripe Keys (später)
- [ ] Resend Keys (später)

### 3. Lokaler Start
- [ ] Dependencies installiert (`npm install`)
- [ ] Development Server gestartet (`npm run dev`)
- [ ] App läuft auf http://localhost:3000
- [ ] Registrierung funktioniert
- [ ] Login funktioniert

## ✅ Phase 2: Services Setup

### 4. Stripe Setup
- [ ] Stripe Account erstellt
- [ ] Test-Modus aktiviert
- [ ] Produkt "StudyCards Premium" erstellt (€7.99)
- [ ] Webhook-Endpoint konfiguriert
- [ ] Keys notiert:
  - [ ] Publishable Key: ________________
  - [ ] Secret Key: ________________
  - [ ] Price ID: ________________
  - [ ] Webhook Secret: ________________

### 5. Resend Setup
- [ ] Resend Account erstellt
- [ ] Domain verifiziert (oder Resend-Domain nutzen)
- [ ] API Key erstellt: ________________

### 6. Lokale Tests
- [ ] Registrierung mit E-Mail-Bestätigung
- [ ] Login/Logout
- [ ] Ordner erstellen
- [ ] Karten erstellen und bearbeiten  
- [ ] Payment-Flow (Stripe Test-Modus)
- [ ] Trial-Ablauf testen

## ✅ Phase 3: Production Deployment

### 7. Vercel Setup
- [ ] Vercel Account mit GitHub verbunden
- [ ] Repository auf GitHub gepusht
- [ ] Vercel Projekt erstellt
- [ ] Environment Variables in Vercel gesetzt
- [ ] Custom Domain konfiguriert (optional)

### 8. Domain & SSL
- [ ] Domain registriert: ________________
- [ ] DNS auf Vercel konfiguriert  
- [ ] SSL-Zertifikat aktiv
- [ ] HTTPS funktioniert

### 9. Production Tests
- [ ] Website erreichbar über Domain
- [ ] Registrierung funktioniert
- [ ] E-Mail-Versendung funktioniert
- [ ] Payment funktioniert (echtes Stripe)
- [ ] Alle Features getestet

### 10. Go-Live
- [ ] Stripe auf Live-Modus umgestellt
- [ ] Website öffentlich verfügbar
- [ ] Monitoring eingerichtet
- [ ] Backup-Strategie implementiert

## 📝 Wichtige URLs & Credentials

### Supabase
- Dashboard: https://app.supabase.com
- Projekt: ________________

### Stripe  
- Dashboard: https://dashboard.stripe.com
- Webhooks: ________________

### Vercel
- Dashboard: https://vercel.com/dashboard
- App URL: ________________

### Domain
- Registrar: ________________
- Domain: ________________
- DNS: ________________

## 🚨 Sicherheits-Checkliste
- [ ] Alle API Keys sind sicher verwahrt
- [ ] Service Role Key niemals im Frontend verwendet
- [ ] Environment Variables nicht in Git committed
- [ ] HTTPS überall aktiviert
- [ ] DSGVO-Konformität geprüft