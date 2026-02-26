# mesna.to storefront

React + Vite + Tailwind CSS landing page for a mesna.to-inspired meat storefront. Built mobile-first, Netlify-ready, with sample data and CTA flows for chefs.

## Tech
- React 19 with TypeScript
- Vite build tool
- Tailwind CSS (custom palette, typography)
- Netlify config via `netlify.toml`

## Available scripts
- `npm run dev` – start local dev server
- `npm run build` – type-check and build
- `npm run preview` – preview built site
- `npm run lint` – run ESLint

## Deploying to Netlify
1. Push this repo to GitHub.
2. In Netlify, create a new site from the repo.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Ensure Node 18+.

## Structure
- `src/App.tsx` – main page layout, sections, and sample products
- `src/index.css` – Tailwind directives, fonts, base theming
- `tailwind.config.js` – scan paths and custom theme
- `netlify.toml` – deploy settings and SPA redirect

## Customizing
- Update `products` in `src/App.tsx` with real catalog data.
- Swap colors/typography in `tailwind.config.js`.
- Replace CTA contacts in the contact section.

## Notes
- No backend or real cart; `Add bundle` only increments a placeholder counter.
- All assets are CSS-based; no external images required.
