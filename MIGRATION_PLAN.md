# 🚀 Migration Plan: Express → Next.js

**Projekt:** BookReviewer App  
**Datum:** 2. Juli 2025  
**Status:** 🟡 In Planung

## 📊 Aktuelle App-Struktur

### Express.js App (Aktueller Stand)
- **Framework:** Express.js 5.1.0 mit Handlebars Templates
- **Routen:** `/books` (Liste), `/book/:id` (Details)
- **Daten:** In-Memory Array mit Büchern und Rezensionen
- **Styling:** Basis HTML ohne CSS Framework
- **Deployment:** Docker + nginx Reverse Proxy
- **Port:** 3000 (App), 8080 (nginx)

### Dateien
```
app.js                 → Server & Routing
package.json          → Dependencies
views/                → Handlebars Templates
  ├── layouts/main.handlebars
  ├── book-list.handlebars
  └── book-detail.handlebars
public_html/          → Statische Dateien
compose.yml           → Docker Compose
Dockerfile           → Container Config
nginx/               → Reverse Proxy Config
```

---

## 📋 Phasen-Plan

### ✅ Phase 1: Vorbereitung und Setup
**Geschätzte Zeit:** 1-2 Stunden

#### 1.1 Git Repository vorbereiten

- [x] Neue Branch `feature/nextjs-migration` erstellen
- [x] Aktuellen Stand committen und taggen als `v1.0-express`
- [x] `.gitignore` für Next.js vorbereiten

#### 1.2 Next.js Projekt initialisieren

- [x] Next.js 14+ mit TypeScript installieren
- [x] App Router Struktur erstellen
- [x] Basis-Konfiguration (`next.config.js`, `tsconfig.json`)
- [x] Entwicklungsserver testen

**Deliverables:**
- Funktionierende Next.js Basis-Installation
- Neue Ordnerstruktur
- TypeScript Konfiguration

---

### 🔄 Phase 2: Core Migration
**Geschätzte Zeit:** 3-4 Stunden

#### 2.1 Datenmodell migrieren
- [ ] TypeScript Interfaces für Books und Reviews erstellen
- [ ] Daten-Layer in separates Modul auslagern
- [ ] Mock-Daten in JSON-Datei oder Konstanten

#### 2.2 Pages/Components erstellen
- [ ] Layout Component (`app/layout.tsx`)
- [ ] Books List Page (`app/books/page.tsx`)
- [ ] Book Detail Page (`app/book/[id]/page.tsx`)
- [ ] Komponenten für Book Cards, Review Lists

#### 2.3 Routing migrieren
- [ ] Express Routes → Next.js App Router
- [ ] Dynamic Routes für Book Details
- [ ] Navigation zwischen Seiten

**Deliverables:**
- Funktionelle Next.js App mit allen bisherigen Features
- TypeScript Typsicherheit
- Client-side Navigation

---

### 🎨 Phase 3: API & Data Fetching
**Geschätzte Zeit:** 2-3 Stunden

#### 3.1 API Routes erstellen
- [ ] `app/api/books/route.ts` - GET alle Bücher
- [ ] `app/api/books/[id]/route.ts` - GET einzelnes Buch
- [ ] Error Handling für API Routes

#### 3.2 Data Fetching implementieren
- [ ] Server Components für initiales Laden
- [ ] Client Components für interaktive Features
- [ ] Loading States und Error Boundaries

**Deliverables:**
- RESTful API mit Next.js API Routes
- Optimierte Data Fetching Patterns
- Bessere User Experience

---

### 🎨 Phase 4: Styling & Enhancement
**Geschätzte Zeit:** 2-3 Stunden

#### 4.1 CSS Framework integrieren
- [ ] Tailwind CSS installieren und konfigurieren
- [ ] Basis-Layout und Typography
- [ ] Component-basierte Styles

#### 4.2 UI/UX Verbesserungen
- [ ] Responsive Design für mobile Geräte
- [ ] Moderne Komponenten (Cards, Buttons, etc.)
- [ ] Hover-Effekte und Transitions
- [ ] Dark Mode (Optional)

#### 4.3 Performance Optimierung
- [ ] Image Optimization konfigurieren
- [ ] Font Optimization
- [ ] Bundle Analyzer setup

**Deliverables:**
- Modernes, responsives Design
- Bessere Performance
- Professionelles Aussehen

---

### 🐳 Phase 5: DevOps & Deployment
**Geschätzte Zeit:** 2-3 Stunden

#### 5.1 Docker Migration
- [ ] Dockerfile für Next.js aktualisieren
- [ ] Multi-stage Build für Production
- [ ] Docker Compose für Development

#### 5.2 nginx Konfiguration
- [ ] nginx für Next.js Static Files
- [ ] Proxy für API Routes
- [ ] Caching Headers optimieren

#### 5.3 Production Build
- [ ] Build-Prozess testen
- [ ] Environment Variables konfigurieren
- [ ] Production Deployment testen

**Deliverables:**
- Produktions-ready Docker Setup
- Optimierte nginx Konfiguration
- Deployment-ready Application

---

### 🧪 Phase 6: Testing & CI/CD
**Geschätzte Zeit:** 2-3 Stunden

#### 6.1 Testing Setup
- [ ] Jest für Unit Tests konfigurieren
- [ ] React Testing Library für Component Tests
- [ ] API Route Tests

#### 6.2 GitHub Actions
- [ ] CI Pipeline für Build & Test
- [ ] Linting und Type Checking
- [ ] Docker Image Build & Push

#### 6.3 E2E Testing (Optional)
- [ ] Playwright für End-to-End Tests
- [ ] Critical User Journey Tests

**Deliverables:**
- Automatisierte Tests
- CI/CD Pipeline
- Quality Gates

---

### 📚 Phase 7: Documentation & Cleanup
**Geschätzte Zeit:** 1 Stunde

#### 7.1 Documentation
- [ ] README.md aktualisieren
- [ ] API Documentation
- [ ] Deployment Guide

#### 7.2 Cleanup
- [ ] Alte Express-Dateien entfernen
- [ ] Dependencies bereinigen
- [ ] Code Review und Refactoring

**Deliverables:**
- Vollständige Dokumentation
- Saubere Codebase
- Migration abgeschlossen

---

## 🎯 Erfolgskriterien

### Funktionale Anforderungen
- [ ] Alle bestehenden Features funktionieren
- [ ] Bücherliste wird korrekt angezeigt
- [ ] Buchdetails mit Rezensionen funktionieren
- [ ] Navigation zwischen Seiten funktioniert
- [ ] Responsive Design auf allen Geräten

### Technische Anforderungen
- [ ] TypeScript ohne Fehler
- [ ] Tests mit >80% Coverage
- [ ] Build-Prozess funktioniert
- [ ] Docker Container startet erfolgreich
- [ ] Performance mindestens gleich/besser als Express

### Qualitäts-Standards
- [ ] Code ist gut dokumentiert
- [ ] Konsistente Code-Formatierung
- [ ] Keine Security-Vulnerabilities
- [ ] SEO-optimiert (Meta Tags, etc.)

---

## 📈 Fortschritt Tracking

| Phase | Status | Start | Ende | Notizen |
|-------|--------|-------|------|---------|
| Phase 1 | ✅ Abgeschlossen | 2. Juli 2025 | 2. Juli 2025 | Git Branch + Next.js Setup |
| Phase 2 | ⚪ Ausstehend | - | - | Core Migration |
| Phase 3 | ⚪ Ausstehend | - | - | API & Data |
| Phase 4 | ⚪ Ausstehend | - | - | Styling |
| Phase 5 | ⚪ Ausstehend | - | - | DevOps |
| Phase 6 | ⚪ Ausstehend | - | - | Testing |
| Phase 7 | ⚪ Ausstehend | - | - | Cleanup |

**Legende:**
- 🟡 Geplant / In Arbeit
- ✅ Abgeschlossen
- ❌ Probleme
- ⚪ Ausstehend

---

## 🔧 Technische Details

### Dependency Changes
```diff
# Entfernen
- express: ^5.1.0
- express-handlebars: ^8.0.3

# Hinzufügen
+ next: ^14.0.0
+ react: ^18.0.0
+ react-dom: ^18.0.0
+ typescript: ^5.0.0
+ @types/react: ^18.0.0
+ @types/node: ^20.0.0
+ tailwindcss: ^3.0.0
```

### Port Changes
- **Development:** 3000 (Next.js dev server)
- **Production:** 3000 (Next.js production)
- **nginx:** 8080 (bleibt gleich)

### File Structure Migration
```diff
# Alt (Express)
- app.js
- views/
- public_html/

# Neu (Next.js)
+ app/
+   layout.tsx
+   page.tsx
+   books/
+     page.tsx
+   book/
+     [id]/
+       page.tsx
+   api/
+     books/
+       route.ts
+       [id]/
+         route.ts
+ components/
+ lib/
+ types/
+ public/
```

---

## 🤝 Nächste Schritte

1. **Team-Review:** Plan durchgehen und Feedback einarbeiten
2. **Phase 1 starten:** Git Branch erstellen und Next.js initialisieren
3. **Regelmäßige Check-ins:** Nach jeder Phase Status-Update

---

**Letzte Aktualisierung:** 2. Juli 2025  
**Nächste Review:** Nach Phase 1 Abschluss
