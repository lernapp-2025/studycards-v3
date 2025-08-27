# StudyCards V3 - Claude Memory

## Projekt Übersicht
**StudyCards** - SaaS Flashcard-App mit €7.99 einmaliger Premium-Zahlung
- **Technologie:** Next.js 14, TypeScript, Supabase, Stripe, Tailwind CSS
- **Deployment:** Vercel (studycards-v3.vercel.app)
- **Ziel:** Vollständig funktionale öffentlich zugängliche Flashcard-App

## Aktueller Status (2025-08-27)
- ✅ **Website ist ONLINE** und funktioniert
- ✅ **Login/Dashboard** funktioniert
- 🔄 **€7.99 Stripe-Zahlung testen** (AKTUELL)
- ❗ **Hartnäckiger client-side STRIPE_SECRET_KEY Fehler** seit Stunden

## Technische Konfiguration

### Umgebungsvariablen (Vercel)
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1RtrVNHJv3NyeDJ7AZIE0y9j (€7.99)
NEXT_PUBLIC_APP_URL=https://studycards-v3.vercel.app
```

### Supabase Setup
- **Projekt:** lernapp-2025
- **Region:** Frankfurt
- **Users Tabelle:** funktioniert, Test-User `tizian.schorr@outlook.de` existiert

### Stripe Setup  
- **Produkt:** StudyCards Premium (€7.99 einmalig)
- **Test-Karte:** 4242 4242 4242 4242
- **Status:** Test-Mode aktiv

## Dateien-Struktur (wichtig)

### Stripe-Integration (PROBLEM-BEREICH)
```
src/lib/
├── stripe.ts               # LEER - nur Konstanten (v2.0.2)
├── stripe-client.ts        # Client-side Stripe (loadStripe)  
├── stripe-server.ts        # Server-side Stripe (checkout, webhook)
└── stripe-OLD.ts           # Alte problematische Version
```

### API Routes
```
src/pages/api/
├── stripe/create-checkout.ts  # Importiert stripe-server.ts ✅
├── stripe/webhook.ts         # Importiert stripe-server.ts ✅  
└── test-checkout.ts          # Alternative für Testing
```

### Frontend Pages
```
src/pages/
├── pricing.tsx              # NEU ERSTELLT (v2.0.2) - kein Stripe-Import
├── pricing-OLD.tsx          # Alte Version (backup)
└── pricing-simple.tsx       # Stripe-Import disabled
```

## Das HAUPTPROBLEM (seit Stunden ungelöst!)

### Symptome:
```javascript
Error: Missing STRIPE_SECRET_KEY environment variable
at 9926 (pricing-16e5bc7c2a588f26.js:1:450)
```

### Bundle-ID: `pricing-16e5bc7c2a588f26.js` 
- **Problem:** Identische Bundle-ID trotz kompletter Code-Änderungen!
- **Bedeutet:** Vercel baut nicht neu oder cached aggressiv

### Lösungsversuche (alle erfolglos):
1. ✅ Stripe client/server-side Trennung
2. ✅ Alle problematischen Imports entfernt  
3. ✅ pricing.tsx komplett neu erstellt
4. ✅ stripe.ts geleert
5. ✅ Redeploy ohne Cache (mehrfach)
6. ❌ **Bundle-ID bleibt identisch!**

### Verdacht: 
- Vercel CDN-Cache Problem
- Oder anderes unsichtbares Import-Problem

## Benutzer-Workflow

### Test-Account:
- **Email:** tizian.schorr@outlook.de  
- **Password:** [vom Benutzer gesetzt]
- **Status:** Angemeldet, Trial abgelaufen

### Payment-Flow:
1. Login → Dashboard 
2. "Upgrade" Button → /pricing
3. ❗ **TrialExpiredModal** zeigt Translation-Keys statt Text
4. "Jetzt upgraden" → Stripe Checkout
5. Test-Karte: 4242 4242 4242 4242

## Translation-Problem
- **Problem:** TrialExpiredModal zeigt "trialExpired.title" statt deutschen Text
- **Ursache:** i18next wird durch Stripe-Fehler blockiert
- **Lösung:** Stripe-Fehler muss zuerst behoben werden

## Aktuelle Todos

### 🔴 KRITISCH (blockiert alles):
1. **STRIPE_SECRET_KEY client-side Fehler beheben**
   - Bundle `pricing-16e5bc7c2a588f26.js` neu bauen lassen
   - Vercel-Cache problem lösen

### 🟡 WICHTIG (danach):
2. **€7.99 Stripe-Zahlung testen**
3. **Stripe-Webhook einrichten** 
4. **Translation-Keys → deutscher Text**

### 🟢 SPÄTER:
5. Admin-System implementieren
6. Trial-Missbrauchsschutz
7. E-Mail-Verifizierung
8. Domain registrieren
9. Website öffentlich machen

## Debug-Commands

### Alle Stripe-Imports finden:
```bash
grep -r "from.*@/lib/stripe" src --include="*.tsx" --include="*.ts"
```

### Bundle-Größe prüfen:
```bash
npm run build && npm run analyze
```

## Erfolgsgeschichte
- **Gestartet:** Als lokales Projekt mit vielen Problemen
- **Erreicht:** Live funktionale Website mit Login/Dashboard
- **Problem:** Ein hartnäckiger Stripe client-side Import-Fehler blockiert Payment-Testing

## Nächster Schritt
**INKOGNITO-TEST:** https://studycards-v3.vercel.app/pricing
- Prüfen ob Bundle-ID endlich geändert hat
- Prüfen ob STRIPE_SECRET_KEY Fehler weg ist

---
*Letzte Aktualisierung: 2025-08-27 15:45*  
*Bundle-ID to watch: pricing-16e5bc7c2a588f26.js*