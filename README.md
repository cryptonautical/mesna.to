# Mesna.to - E-commerce Prodavnica Suvog Mesa

Moderan i elegantan e-commerce sajt za prodaju tradicionalnog srpskog suvog mesa. Sajt je izgrađen sa React, TypeScript, Tailwind CSS, tRPC, i MySQL bazom podataka.

## Karakteristike

- **Katalog proizvoda** - 6 autentičnih srpskih proizvoda (sremska kobasica, suvi vrat, pečenica, butkica, kolenica, mast)
- **Shopping korpa** - Lako dodavanje i uklanjanje proizvoda sa dinamičkim izračunavanjem cene
- **Naručivanje** - Forma sa validacijom za prikupljanje podataka kupca
- **Plaćanje** - Podrška za plaćanje pouzećem (cash on delivery)
- **Email notifikacije** - Automatsko slanje narudžbina na test123@gmail.com
- **Dark/Light mode** - Prilagodljiva šema boja sa tamno-crvenom kao dominantnom bojom
- **Responzivni dizajn** - Savršen prikaz na mobilnim i desktop uređajima
- **Loading animacija** - Elegantna animacija tokom učitavanja stranice

## Tehnološki stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite
- **Backend**: Express 4, tRPC 11, Node.js
- **Baza podataka**: MySQL / TiDB
- **Autentifikacija**: Manus OAuth
- **Email**: Manus Notification API
- **Package manager**: pnpm

## Lokalni razvoj

### Preduslov

- Node.js 22+ (sa pnpm)
- MySQL baza podataka (ili TiDB)
- Git

### Instalacija

1. **Kloniraj projekat**
   ```bash
   git clone <repository-url>
   cd mesna_to
   ```

2. **Instaliraj zavisnosti**
   ```bash
   pnpm install
   ```

3. **Postavi okruženje**
   Kreiraj `.env` fajl sa sledećim varijablama:
   ```env
   DATABASE_URL=mysql://user:password@localhost:3306/mesna_to
   JWT_SECRET=your-secret-key-here
   VITE_APP_ID=your-manus-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   OWNER_OPEN_ID=your-owner-open-id
   OWNER_NAME=Your Name
   BUILT_IN_FORGE_API_URL=https://api.manus.im
   BUILT_IN_FORGE_API_KEY=your-api-key
   VITE_FRONTEND_FORGE_API_KEY=your-frontend-api-key
   VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
   VITE_ANALYTICS_ENDPOINT=your-analytics-endpoint
   VITE_ANALYTICS_WEBSITE_ID=your-website-id
   ```

4. **Kreiraj bazu podataka**
   ```bash
   pnpm db:push
   ```
   Ova komanda će:
   - Generisati Drizzle migracije
   - Primeniti migracije na bazu podataka
   - Kreiraj sve potrebne tabele

5. **Inicijalizuj proizvode**
   ```bash
   node seed-products.mjs
   ```
   Ova komanda će učitati 6 proizvoda u bazu podataka.

6. **Pokreni dev server**
   ```bash
   pnpm dev
   ```
   Sajt će biti dostupan na `http://localhost:3000`

## Produkcijski deploy

### Manus hosting (preporučeno)

Manus platforma nudi ugrađeni hosting sa automatskim skaliranjem i SSL certifikatima.

1. **Kreiraj checkpoint**
   ```bash
   # Checkpoint je već kreiran u dev okruženju
   # Možeš ga videti u Management UI-u
   ```

2. **Publish sajt**
   - Otvori Management UI
   - Klikni na "Publish" dugme
   - Čekaj da se sajt deploya (obično 2-5 minuta)
   - Tvoj sajt će biti dostupan na `https://mesna-to.manus.space`

3. **Prilagodi domenu** (opciono)
   - U Settings → Domains možeš:
     - Promeniti auto-generisanu domenu
     - Kupiti novu domenu direktno u Manus
     - Povezati postojeću domenu

### Drugi hosting provajderi

Ako koristiš drugačiji hosting (Railway, Render, Vercel, itd.):

1. **Build projekat**
   ```bash
   pnpm build
   ```

2. **Pokreni produkcijski server**
   ```bash
   pnpm start
   ```

3. **Postavi okruženje**
   Postavi sve varijable iz `.env` fajla na hosting platformi.

4. **Prilagodi bazu podataka**
   - Koristi produkcijsku MySQL bazu umesto lokalne
   - Pokreni migracije: `pnpm db:push`

## Struktura projekta

```
mesna_to/
├── client/                 # React frontend
│   ├── public/            # Statički assets (logo, favicon)
│   ├── src/
│   │   ├── components/    # Reusable React komponente
│   │   ├── pages/         # Stranice (Home, Cart, Checkout, OrderConfirmation)
│   │   ├── contexts/      # React contexts (ThemeContext)
│   │   ├── hooks/         # Custom hooks (useCart)
│   │   ├── lib/           # Utility funkcije (tRPC client)
│   │   ├── App.tsx        # Root komponenta sa rutama
│   │   └── index.css      # Global stilovi sa tamno-crvenom šemom
│   └── index.html         # HTML template
├── server/                 # Express backend
│   ├── routers.ts         # tRPC procedure definicije
│   ├── db.ts              # Database query helpers
│   ├── _core/             # Framework plumbing
│   │   ├── email.ts       # Email slanje (Manus Notification API)
│   │   ├── context.ts     # tRPC context sa auth-om
│   │   └── index.ts       # Express server setup
│   └── auth.logout.test.ts # Vitest test primer
├── drizzle/               # Database schema i migracije
│   └── schema.ts          # Drizzle ORM schema
├── seed-products.mjs      # Script za inicijalizaciju proizvoda
├── package.json           # Dependencies i scripts
└── README.md              # Ova datoteka
```

## Baza podataka

### Tabele

**products** - Katalog proizvoda
- `id` - Primarni ključ
- `name` - Naziv proizvoda
- `description` - Opis
- `price` - Cena u RSD
- `image` - URL slike

**orders** - Narudžbine
- `id` - Primarni ključ
- `firstName` - Ime kupca
- `lastName` - Prezime kupca
- `address` - Adresa dostave
- `phone` - Telefonski broj
- `notes` - Dodatne napomene
- `items` - JSON sa stavkama narudžbine
- `totalPrice` - Ukupna cena
- `status` - Status narudžbine (pending, confirmed, shipped, delivered)
- `createdAt` - Vreme kreiranja

### Migracije

Sve migracije se automatski primenjuju sa:
```bash
pnpm db:push
```

Ako trebas da resetuješ bazu:
```bash
# Obriši sve tabele i kreiraj ih ponovo
pnpm db:push --force
```

## API Endpoints

### tRPC Procedure

Sve komunikacije sa serverom se vrše preko tRPC procedure-a (nema REST API-ja).

**Javne procedure:**
- `products.list` - Preuzmi sve proizvode
- `orders.create` - Kreiraj novu narudžbinu

**Zaštićene procedure:**
- `auth.me` - Preuzmi trenutnog korisnika
- `auth.logout` - Odjavi korisnika

## Email notifikacije

Narudžbine se automatski šalju na `test123@gmail.com` korišćenjem Manus Notification API-ja.

Email sadrži:
- Listu proizvoda sa količinama
- Ukupnu cenu
- Podatke kupca (ime, prezime, adresa, telefon)
- Dodatne napomene

## Dark/Light mode

Sajt podržava dark i light mode sa tamno-crvenom (#8B0000) kao dominantnom bojom.

- **Light mode**: Tamno-crvena pozadina sa belim tekstom u header-u
- **Dark mode**: Tamno-crvena pozadina sa crnim tekstom u ostatku sajta

Korisnik može da prebaci mode klikom na ikonu u header-u.

## Testiranje

### Unit testovi

Pokreni sve testove:
```bash
pnpm test
```

Testovi se nalaze u `server/*.test.ts` fajlovima.

### Ručno testiranje

1. **Dodaj proizvod u korpu** - Klikni na "Dodaj u korpu" dugme
2. **Otvori korpu** - Klikni na ikonu korpe u header-u
3. **Kreiraj narudžbinu** - Popuni formu i klikni "Naruči"
4. **Proveri email** - Narudžbina bi trebala da stigne na test123@gmail.com

## Troubleshooting

### Dev server se ne pokreće

```bash
# Obriši node_modules i reinstaliraj
rm -rf node_modules
pnpm install

# Restartuj dev server
pnpm dev
```

### Baza podataka nije dostupna

```bash
# Proveri da li je MySQL server pokrenut
mysql -u root -p

# Proveri DATABASE_URL u .env fajlu
```

### Logo se ne prikazuje

- Proveri da li je `logo-transparent.png` u `client/public/` folderu
- Restartuj dev server: `pnpm dev`

### Email se ne šalje

- Proveri da li su Manus API kredencijali ispravni
- Proveri da li je `BUILT_IN_FORGE_API_KEY` postavljen
- Pogledaj server logove za greške

## Performanse

- **Frontend**: Vite omogućava brzo učitavanje sa HMR (Hot Module Replacement)
- **Backend**: tRPC koristi superjson za efikasnu serializaciju
- **Baza**: MySQL indeksi su optimizovani za brze upite
- **CSS**: Tailwind CSS se koristi sa PurgeCSS za minimalne bundle veličine

## Sigurnost

- **Autentifikacija**: Manus OAuth za sigurnu prijavu
- **Validacija**: Svi podaci se validiraju na frontend-u i backend-u
- **HTTPS**: Sve konekcije su šifrovane
- **CORS**: Samo dozvoljeni origin-i mogu da pristupe API-ju

## Doprinos

Ako želiš da doprineseš projektu:

1. Kreiraj novi branch: `git checkout -b feature/nova-funkcionalnost`
2. Napravi izmene i testove
3. Pošalji pull request

## Licenca

MIT License - Slobodno koristi i modifikuj kod.

## Kontakt

Za pitanja ili sugestije, kontaktiraj tim na support@mesna.to

---

**Zadnja ažuriranja**: Februar 2026
**Verzija**: 1.0.0
