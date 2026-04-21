# Tech Spec — Masjid Muntada al-Islam Financial Management App

## Dependances

| Package | Version | Role |
|---------|---------|------|
| react | ^19.1 | Framework UI |
| react-dom | ^19.1 | Rendu DOM |
| react-router-dom | ^7.6 | Routage client (2 pages : /, /admin) |
| recharts | ^2.15 | Graphiques BarChart et PieChart |
| lucide-react | ^0.501 | Iconographie (icônes statiques) |
| framer-motion | ^12.9 | Animations de pages, modales, listes, toasts |
| tailwindcss | ^4.1 | Styling utilitaire |
| @tailwindcss/vite | ^4.1 | Intégration Tailwind + Vite |
| vite | ^6.3 | Bundler |
| @vitejs/plugin-react | ^4.4 | Plugin React pour Vite |
| typescript | ^5.8 | Typage statique |
| @types/react | ^19.1 | Types React |
| @types/react-dom | ^19.1 | Types ReactDOM |

---

## Inventaire Composants

### Layout (partagés entre les 2 pages)

| Composant | Source | Reutilisation |
|-----------|--------|---------------|
| MosqueHeader | Custom | 2 pages — barre supérieure fixe avec logo, titre, actions contextuelles (filtre année ou logout) |
| BottomNav | Custom | Mobile uniquement — barre de navigation inférieure à 3 onglets |
| DesktopSidebar | Custom | Desktop uniquement — sidebar de 260px avec navigation verticale |
| AppLayout | Custom | Wrapper conditionnel : BottomNav (mobile) ou DesktopSidebar (desktop) selon breakpoint 768px |

### Sections — Page Dashboard (publique)

| Composant | Source | Notes |
|-----------|--------|-------|
| BalanceHero | Custom | Carte solde avec mini-indicateur tendance |
| StatsGrid | Custom | Grille 2×2 (mobile) / 1×4 (desktop) de StatCards |
| RevenueExpenseChart | Custom | BarChart Recharts — mensuel, 2 séries (revenus/dépenses) |
| CategoryDistributionChart | Custom | PieChart Recharts — donut, distribution dépenses par catégorie |
| RecentTransactions | Custom | TransactionListCard limitée aux 5 dernières entrées |

### Sections — Page Admin (sécurisée)

| Composant | Source | Notes |
|-----------|--------|-------|
| AdminStatsBar | Custom | 3 cartes compactes en défilement horizontal (mobile) ou grille 3 colonnes (desktop) |
| FilterBar | Custom | Ligne de filtres : année, catégorie, type + bouton "Nouvelle transaction" |
| TransactionTable | Custom | Table responsive : vue tableau (desktop) ou liste de cartes (≤640px). Tri, pagination, actions ligne |
| BackupCard | Custom | Carte avec 3 boutons : sauvegarde JSON, restauration JSON, export CSV |

### Composants Réutilisables

| Composant | Source | Utilisé par |
|-----------|--------|-------------|
| StatCard | Custom | BalanceHero, StatsGrid, AdminStatsBar — 3 variantes (income, expense, balance) via prop |
| TransactionListCard | Custom | RecentTransactions (dashboard) + TransactionTable en mode mobile |
| CategoryBadge | Custom | TransactionListCard, TransactionTable — couleur déterminée par type |
| FilterPill | Custom | FilterBar, MosqueHeader (sélecteur année) |
| FAB | Custom | Admin uniquement — bouton flottant "+" |
| YearSelectorSheet | Custom | MosqueHeader — bottom sheet (mobile) ou dropdown (desktop) |
| AdminLoginModal | Custom | Page admin — overlay authentification avec mot de passe |
| TransactionForm | Custom | FAB + FilterBar + TransactionTable — modale ajout/édition |
| ConfirmDialog | Custom | TransactionTable (suppression ligne), BackupCard (restauration écrasement) |
| Toast | Custom | Global — système de notification par contexte React |
| SkeletonLoader | Custom | État de chargement initial pour toutes les sections |

### Assets

| Asset | Source |
|-------|--------|
| mosque-logo (SVG) | Inline SVG — icône silhouette mosquée, 32×32, couleur via CSS fill |
| mosque-og (image) | [ASSET: Image] — Open Graph 1200×630, généré une seule fois |

---

## Plan d'Animation

| Animation | Bibliothèque | Approche | Complexité |
|-----------|-------------|----------|------------|
| Entrée sections staggered (dashboard + admin) | Framer Motion | `motion.div` avec `initial/animate`, `staggerChildren: 0.05–0.1s` sur conteneur parent. Variants partagés : `opacity: 0→1`, `y: 16→0`, `duration: 0.3s`, ease `[0.16, 1, 0.3, 1]` | Low |
| Transition page Dashboard ↔ Admin | Framer Motion | `AnimatePresence` wrapper route + `motion.div` avec `opacity 0→1`, `duration: 0.2s`. Mode wait pour éviter chevauchement | Low |
| Login modal — apparition | Framer Motion | Backdrop `opacity 0→1` (200ms). Modal `opacity 0→1` + `scale 0.95→1` (250ms, spring `type: "spring", stiffness: 300, damping: 25`) | Low |
| Login modal — shake erreur | Framer Motion | `animate` avec séquence `x: [0, -6, 6, -6, 6, 0]` sur le conteneur modal en réponse à l'état erreur, `duration: 0.3s` | Low |
| Login modal — disparition | Framer Motion | Inverse apparition, `AnimatePresence` gère exit | Low |
| Year selector bottom sheet | Framer Motion | `motion.div` avec `y: "100%"→"0%"`, `borderRadius: "20px 20px 0 0"`. Backdrop `opacity 0→1`. Drag vers le bas pour fermer (`drag="y"`, `dragConstraints`, `onDragEnd` vérifie velocity/offset) | Medium |
| Transaction form modal | Framer Motion | Desktop : même pattern que login modal (spring). Mobile : bottom sheet identique à YearSelectorSheet | Low |
| Confirm dialog | Framer Motion | Apparition/disparition identique login modal | Low |
| Toast notification | Framer Motion | `AnimatePresence` + `motion.div` : `y: -20→0`, `opacity: 0→1` (200ms ease-out). Exit : inverse (150ms). Auto-dismiss après 3s via `setTimeout` | Low |
| FAB hover/press | Framer Motion | `whileHover: { scale: 1.05, boxShadow }`, `whileTap: { scale: 0.95 }` | Low |
| Bottom nav active dot | Framer Motion | `layoutId` pour animation fluide du point indicateur entre les onglets, `transition: { type: "spring", stiffness: 400, damping: 30 }` | Low |
| Skeleton pulse | CSS | `@keyframes pulse { 0%, 100% { opacity: 0.5 } 50% { opacity: 1 } }`, `animation: pulse 1.5s infinite`. Pure CSS, pas de bibliothèque nécessaire | Low |
| Graphiques (BarChart, PieChart) | Recharts natif | `animationBegin`, `animationDuration` (800ms) inclus dans Recharts. Pas de bibliothèque additionnelle | Low |
| Scroll horizontal filtres/tablette | CSS | `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-snap-align: start`. Pure CSS | Low |

---

## Architecture Etat & Logique

### Gestion d'État

Aucun state manager externe (Redux, Zustand) n'est requis. L'application est entièrement client-side avec `localStorage` comme seule source de persistance. Deux Contextes React suffisent :

1. **AuthContext** — état d'authentification admin (`isAdmin: boolean`, timestamp session). Fournit `login(password)`, `logout()`, `isSessionValid()`. La session expire après 30 min d'inactivité.

2. **DataContext** — données financières + année sélectionnée + filtres admin. Fournit CRUD complet : `addTransaction()`, `updateTransaction()`, `deleteTransaction()`, `setYear()`, `setFilters()`. Toutes les mutations écrivent immédiatement dans `localStorage`.

3. **ToastContext** — file de notifications. Fournit `showToast(message, variant, duration)`. Consommé globalement via le composant Toast monté dans AppLayout.

### LocalStorage — Schéma Données

Clé unique `masjid_finance_data` :
```
{
  "2025-2026": [ { id, type, category, description, amount, date } ],
  "2024-2025": [ ... ]
}
```

Clé `masjid_finance_auth` : `{ isAdmin: true, timestamp: number }`

### Logique Dérivée

Tous les totaux, agrégations graphiques, et statistiques sont calculés via des hooks utilitaires custom (pas de bibliothèque de sélecteurs) :
- `useTransactions(year?, filters?)` — retourne liste filtrée/triée
- `useTotals(year?)` — retourne revenus, dépenses, solde
- `useChartData(year?)` — retourne données formatées pour Recharts (mensuelles pour BarChart, par catégorie pour PieChart)

### Routing

Deux routes via React Router DOM : `/` (Dashboard), `/admin` (Admin). Guard sur `/admin` : si non authentifié, affiche AdminLoginModal au-dessus de la page (pas de redirect). Pas de lazy-load — les deux pages sont légères.

### Responsive — Breakpoint Unique

Seul breakpoint : **768px** (mobile ↔ desktop). Détecté via `matchMedia` dans un hook custom `useBreakpoint()`. Ce hook contrôle le rendu conditionnel de BottomNav/DesktopSidebar, du layout grille (2×2 ↔ 1×4), du mode table ↔ liste cartes, et du mode modale ↔ bottom sheet.
