# FleetPulse

Real-time device farm monitoring dashboard — a Vue 3 + TypeScript portfolio project.

## Features

- Real-time device simulation (battery, CPU, memory, connectivity status)
- Device grid with live status badges and selection
- Per-device detail view with CPU / memory / battery time-series charts (Chart.js)
- Test run queue: filter by status, queue new runs, live progress tracking
- Alerts feed with unread tracking (device errors, offline events, failed runs)
- Dark mode (default) with persisted theme preference
- Unit tests with Vitest (48 tests)

## Tech Stack

- Vue 3 (`<script setup>`, Composition API) + TypeScript
- Vite, Vue Router, Pinia
- Chart.js, Tailwind CSS v4
- Vitest

## Getting Started

```bash
npm install
npm run dev        # start dev server
npx vitest run     # run unit tests
npm run build      # production build
```
