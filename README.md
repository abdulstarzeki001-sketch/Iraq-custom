# Iraq Customs — Cinematic Workspace

This repository contains the operational customs workflow and a newly added cinematic progressive React interface.

## Live

- [Main workspace](https://iraq-custom.pages.dev/)
- [Shipment document and A4 PDF](https://iraq-custom.pages.dev/document)
- [Shipment input](https://iraq-custom.pages.dev/form.html)
- [Traders and ledger](https://iraq-custom.pages.dev/traders.html)

## Architecture

- `creative/` — React 19, TypeScript, Tailwind CSS 4, Vite 7, Motion, GSAP, Three.js and React Three Fiber source.
- `cinematic/` — production-compatible progressive UI runtime and visual skin that enhance the existing pages.
- `creative-app/` — CI-produced production bundle built with Vite (separate standalone presentation).
- Existing `index-page.js`, `form-page.js`, `traders-page.js`, `document-page.js`, `core.js`, `storage.js`, company data, and export logic are retained and operate without the React layer.

The A4 document itself is excluded from immersive visual effects. Dynamic table height, QR alignment, precise millimeter gaps, existing PDF export, and legacy records are preserved.

Build: `cd creative && npm install && npm run check`. CI runs TypeScript checks, the production build and regression smoke checks. The site is a locally operated document interface; it does **not** provide independent government verification.
