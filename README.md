# mesna.to storefront

Mobile-first storefront for mesna.to, with product selection by weight, a cart, cash-on-delivery checkout, and a Netlify email function. The production build prerenders the storefront so product and editorial content is available without JavaScript to search and AI crawlers.

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
- `src/App.tsx` – storefront, product data, cart, and checkout
- `src/index.css` – Tailwind directives, fonts, base theming
- `tailwind.config.js` – scan paths and custom theme
- `netlify.toml` – deploy settings and SPA redirect
- `public/robots.txt` and `public/sitemap.xml` – search crawler configuration
- `public/llms.txt` – concise, machine-readable storefront facts for AI answer engines
- `src/entry-server.tsx` and `scripts/prerender.mjs` – production HTML prerendering

## Customizing
- Update `products` in `src/App.tsx` with real catalog data.
- Swap colors/typography in `tailwind.config.js`.
- Update prices, product copy, and delivery information when they change.

## Notes
- The Netlify function requires a `GMAIL_PASS` environment variable.
- Canonical URLs and structured data currently use `https://mesna.to/`.
- Keep visible prices, FAQ answers, JSON-LD, and `public/llms.txt` synchronized when the offer changes.
