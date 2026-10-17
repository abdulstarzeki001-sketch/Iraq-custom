# Iraq Customs — Cinematic UI

This is a progressive React + TypeScript shell for the existing Iraq-custom web application. Existing document creation, search, storage, company data, trader ledger, and PDF output remain in the original JavaScript/HTML pages; do not replace those operational modules with demo data. The precise A4 `#documentPage` is not styled by the cinematic layer.

## Tech

- React 19 + TypeScript
- Tailwind CSS v4 + Vite 7 (standalone build under `/creative-app/`)
- Motion (`motion/react`) for component entry and interaction
- GSAP ScrollTrigger for desktop service cards
- React Three Fiber / Three.js in lazy-loaded 3D scene
- Custom designed glass surfaces, aurora, mobile navigation and Cairo Arabic RTL typography

## Build

```
cd creative
npm install
npm run check
```

The `creative-app` production preview is output in repository root. The primary existing pages use the checked-in `cinematic/` progressive runtime so functionality does not depend on rebuilding. The runtime pins compatible dependency versions via import map and lazily loads 3D only when needed. A CDN failure leaves the legacy business workflows usable.

## Regression criteria

- Company search gate and selection in `/` still works
- Existing `/form.html` field IDs, save logic, upload and QR remain intact
- Trader account and ledger logic in `/traders.html` remains intact
- `/document` A4/QR/notes PDF coordinates and dynamic spacing remain unchanged
- 320px mobile works without horizontal scrolling; reduced motion disables expensive animations
- Export/print hides all immersive chrome
