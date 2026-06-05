# TODO

- [ ] Inspect current `app/reading/page.tsx` iframe markup and existing loading / blocked overlays.
- [ ] Plan CSS changes: replace fixed `w-[80vw] h-[80vh]` with a responsive wrapper that keeps the iframe centered, uses exactly 80vw desktop, 95vw mobile, and enforces a comfortable aspect ratio/max-height.
- [ ] Implement iframe loading performance improvements:
  - [ ] Use `loading="lazy"` on the iframe.
  - [ ] Defer iframe src assignment until DOM is fully interactive (`DOMContentLoaded` / `requestIdleCallback`), via a small client-side script logic.
  - [ ] Add a spinner/skeleton overlay inside the iframe wrapper while the iframe is not loaded.
- [ ] Wire existing `loaded` state to hide the skeleton and mark successful load.
- [ ] Update any related CSS in `app/globals.css` if needed (spinner/skeleton + aspect-ratio wrapper classes).
- [ ] Run `npm test` / `npm run lint` (or at least `npm run build`) to verify TypeScript/ESLint.

