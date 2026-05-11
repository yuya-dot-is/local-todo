# Local TODO — Claude Code Guide

## Project
PWA-enabled TODO app. Runs entirely in the browser, no backend.
Data persisted via Zustand + localStorage.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS v3 (dark glass morphism theme)
- Zustand (state + localStorage persistence)
- Framer Motion (UI animations)
- React Three Fiber (animated 3D background)
- vite-plugin-pwa (offline, installable)

## Commands
```
npm run dev      # dev server
npm run build    # production build (tsc + vite build)
npm run lint     # eslint
npm run preview  # preview production build
```

## Deploy
```
npx wrangler pages deploy dist
```

## Architecture
- `src/store/useTodoStore.ts` — all state, persisted via Zustand middleware
- `src/types/index.ts` — shared TypeScript types
- `src/components/` — all UI components
- Dark mode default; no light mode toggle needed
- All data is browser-local; no API calls
