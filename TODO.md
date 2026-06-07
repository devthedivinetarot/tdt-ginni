# TODO

- [ ] Update `app/reading/page.tsx` so the chat iframe sits in a parent wrapper sized to exactly 90vw x 90vh and centered.
- [ ] Ensure wrapper/iframe have no internal padding/margins and fill the wrapper exactly (iframe uses width/height 100% and display:block).
- [x] Add a CSS override (high specificity) in inline `app/reading/page.tsx` to strip iframe default borders/spacing and neutralize any global styles that might add margins/padding.

`