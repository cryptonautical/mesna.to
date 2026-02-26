import { useMemo, useState } from 'react'

type Product = {
  name: string
  cut: string
  price: string
  origin: string
  badge?: string
  description: string
  image: string
}

type CartItem = {
  id: string
  product: Product
  grams: number
}

const parsePriceToNumber = (price: string) => {
  const numeric = Number(price.replace(/[^\d.,]/g, '').replace(',', '.'))
  return Number.isFinite(numeric) ? numeric : 0
}

const formatRsd = (value: number) =>
  new Intl.NumberFormat('sr-RS', { style: 'currency', currency: 'RSD', maximumFractionDigits: 0 }).format(
    value,
  )

const formatWeight = (grams: number) =>
  grams >= 1000 ? `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 2)} kg` : `${grams} g`

const products: Product[] = [
  // {
  //   name: 'Umljanski Kulen',
  //   cut: 'Tradicionalna kobasica',
  //   price: '1200 RSD',
  //   origin: 'Srbija',
  //   badge: 'Autentično',
  //   description: 'Srpska kobasica od svinjskog mesa u prirodnom crevu sa začinima, idealna uz hleb i meze.',
  //   image: '/kulen.jpg',
  // },
  {
    name: 'Suvi Vrat',
    cut: 'Suvo meso',
    price: '1500 RSD',
    origin: 'Srbija',
    badge: 'Popularno',
    description: 'Nežno suvo meso od vrata bogatog ukusa. Idealno predjelo ili meze uz rakiju.',
    image: '/vrat.jpeg',
  },
  {
    name: 'Pečenica',
    cut: 'Suvo meso',
    price: '1500 RSD',
    origin: 'Srbija',
    description: 'Klasična pečenica od biranog mesa. Bogat ukus i meka tekstura.',
    image: '/pecenica.jpeg',
  },
  {
    name: 'Dimljena Butkica',
    cut: 'Dimljeno meso',
    price: '850 RSD',
    origin: 'Srbija',
    description: 'Dimljeno meso od zadnje noge sa karakterističnim ukusom, gurmanski izbor.',
    image: '/butkica.jpeg',
  },
  {
    name: 'Dimljena Kolenica',
    cut: 'Dimljeno meso',
    price: '850 RSD',
    origin: 'Srbija',
    description: 'Fina kolenica sa bogatim ukusom i nežnom teksturom, za posebne prilike.',
    image: '/kolenica.jpeg',
  },
  {
    name: 'Sušeni But',
    cut: 'Suvo meso',
    price: '1500 RSD',
    origin: 'Srbija',
    description: 'Suvo meso od zadnje noge sa izraženim ukusom, delicija za poznavaoce.',
    image: '/but.jpeg',
  },
  {
    name: 'Mast',
    cut: 'Tradicionalna mast',
    price: '250 RSD',
    origin: 'Srbija',
    description: 'Tradicionalna mast od svinjskog sala sa začinima, za kuvanje ili kao predjelo.',
    image: '/mast.jpg',
  },
]

const highlights = [
  {
    title: 'Pratljivo poreklo',
    text: 'Direktni odnosi sa farmama i partnerima za zrenje u regionu.',
  },
  {
    title: 'Rez po meri',
    text: 'Porcioniranje u pogonu po specifikaciji šefa kuhinje, bez nagađanja.',
  },
  {
    title: 'Hladni lanac',
    text: 'Isporučujemo isti dan u termo ambalaži, spremno za servis.',
  },
]

const advantages = [
  {
    title: 'Sušenje i dimljenje',
    text: 'Kontrolisana mikroklima za autentičan ukus suvog i dimljenog mesa.',
  },
  {
    title: 'Partnerstva sa kuvarima',
    text: 'Kreirano uz sugestije kuhinja širom regiona da bi porcije bile tačne.',
  },
  {
    title: 'Moderno mesarenje',
    text: 'Primal, podprimal ili gotovi rezovi prilagođeni vašem meniju.',
  },
]

const StoryCard = () => (
  <div className="relative overflow-hidden rounded-3xl bg-stone-900 text-stone-50 shadow-glow">
    <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-brand/25 blur-3xl" />
    <div className="absolute -right-16 top-16 h-32 w-32 rounded-full bg-gold/25 blur-3xl" />
    <div className="relative p-8">
      <p className="text-sm uppercase tracking-[0.25em] text-gold/90">Naša priča</p>
      <h3 className="font-display text-3xl font-semibold leading-tight">Od farme do trpeze</h3>
      <p className="mt-4 text-stone-100/80">
        Mesna.to donosi disciplinovanu nabavku, sušenje i dimljenje mesa za moderne kuhinje. Biramo
        sezonske serije, spremamo ih u sopstvenim komorama i sečemo po specifikaciji da biste vi mogli
        da se fokusirate na tanjir.
      </p>
      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-gold">
        <span>Veruju nam kuhinje širom Instagrama</span>
      </div>
    </div>
  </div>
)

const ProductCard = ({ product, onOpen }: { product: Product; onOpen: () => void }) => (
  <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-100/60 bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-glow">
    <div className="absolute right-3 top-3 text-sm text-stone-500">{product.origin}</div>
    {product.badge && (
      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-dark">
        {product.badge}
      </span>
    )}
    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
      <img
        src={product.image}
        alt={`${product.name} placeholder`}
        loading="lazy"
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col gap-3 p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold text-stone-900">{product.name}</h3>
        <span className="rounded-full bg-stone-50 px-3 py-1 text-sm font-semibold text-brand-dark">{product.price}</span>
      </div>
      <p className="text-sm uppercase tracking-[0.14em] text-stone-500">{product.cut}</p>
      <p className="text-stone-600">{product.description}</p>
      <div className="mt-auto flex items-center gap-2">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
          onClick={onOpen}
          aria-label={`Kupi - ${product.name}`}
        >
          Kupi
        </button>
      </div>
    </div>
  </article>
)

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isThankYou, setIsThankYou] = useState(false)
  const [isSendingOrder, setIsSendingOrder] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)
  const [pendingGrams, setPendingGrams] = useState(100)
  const bestSellers = useMemo(() => products.slice(0, 3), [])

  const totalGrams = useMemo(() => cartItems.reduce((sum, item) => sum + item.grams, 0), [cartItems])
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.grams / 1000) * parsePriceToNumber(item.product.price), 0),
    [cartItems],
  )

  const handleAddToCart = (product: Product, grams: number) => {
    setCartItems((prev) => [...prev, { id: crypto.randomUUID(), product, grams }])
  }

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckoutOpen = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
    setIsThankYou(false)
  }

  const gramOptions = useMemo(
    () => [
      ...Array.from({ length: 10 }, (_, i) => (i + 1) * 100),
      ...Array.from({ length: 9 }, (_, i) => (i + 2) * 1000),
    ],
    [],
  )

  const openAddModal = (product: Product) => {
    setPendingProduct(product)
    setPendingGrams(100)
    setIsCartOpen(false)
  }

  const confirmAdd = () => {
    if (!pendingProduct) return
    handleAddToCart(pendingProduct, pendingGrams)
    setPendingProduct(null)
  }

  const cartCount = cartItems.length

  return (
    <div className="min-h-screen bg-transparent text-stone-900">
      <div className="absolute inset-0 -z-10 bg-grid bg-[size:22px_22px] opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-brand/6 via-transparent to-transparent" aria-hidden />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-10 sm:px-10 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-100/80 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-100 bg-white shadow-card">
              <img src="/logo.png" alt="Mesna.to logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-stone-500">Mesna.to</p>
              <p className="font-semibold text-stone-900">Kurirano meso za moderne kuhinje</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-stone-700">
            <a className="rounded-full px-3 py-2 transition hover:bg-stone-100" href="#products">
              Rezovi
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-stone-100" href="#why-us">
              Zašto mi
            </a>
            <a className="rounded-full px-3 py-2 transition hover:bg-stone-100" href="#contact">
              Kontakt
            </a>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
              onClick={() => setIsCartOpen(true)}
              aria-label="Otvori korpu"
            >
              Korpa <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">{cartCount}</span>
            </button>
          </nav>
        </header>

        <main className="mt-12 space-y-20">
          <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-dark/80">mesna.to</p>
              <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Suvo i dimljeno svinjsko meso sa tradicijom, sečeno po meri i isporučeno uz disciplinu.
              </h1>
              <p className="max-w-2xl text-lg text-stone-600">
                Gradite meni na pratljivom, suvom i dimljenom svinjskom mesu. Mi porcioniramo,
                vakumiramo i isporučujemo istog dana da svaki servis počne jednako.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
                >
                  Pogledaj ponudu
                  <span aria-hidden>→</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-800 transition hover:border-brand hover:text-brand-dark"
                >
                  Pozovi mesara
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-stone-100 bg-white/70 p-4 text-sm shadow-card"
                  >
                    <p className="font-semibold text-stone-900">{item.title}</p>
                    <p className="mt-2 text-stone-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <StoryCard />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-card">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Hladni lanac</p>
                  <h3 className="mt-2 text-3xl font-bold text-stone-900">0°C - 2°C</h3>
                  <p className="text-stone-600">Stalno hlađeno od pogona do vaših vrata.</p>
                </div>
                <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-card">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Sušione i dimnice</p>
                  <h3 className="mt-2 text-3xl font-bold text-stone-900">4 komore</h3>
                  <p className="text-stone-600">Prilagošena vlažnost i dim za svinjske delikatese.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="products" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-brand-dark/80">Rezovi</p>
                <h2 className="font-display text-3xl font-semibold">Izdvojeni izbor</h2>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  onOpen={() => openAddModal(product)}
                />
              ))}
            </div>
          </section>

          <section id="why-us" className="grid gap-8 rounded-3xl border border-stone-100 bg-white/70 p-8 shadow-card lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-dark/80">Zašto šefovi ostaju</p>
              <h2 className="font-display text-3xl font-semibold">Doslednost susreće ukus</h2>
              <p className="text-lg text-stone-600">
                Spremni rezovi, predvidivo sušenje i kutije sa jasnom deklaracijom porekla, težine i
                datuma. Mise en place ostaje efikasan, gosti osećaju razliku.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {advantages.map((item) => (
                  <div key={item.title} className="rounded-2xl bg-stone-50 p-4 shadow-inner">
                    <p className="font-semibold text-stone-900">{item.title}</p>
                    <p className="mt-2 text-stone-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-brand/15 bg-brand/5 p-6 text-brand-dark shadow-card">
                <p className="text-sm uppercase tracking-[0.24em]">Najtraženije</p>
                <div className="mt-4 space-y-3">
                  {bestSellers.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 text-stone-900 shadow"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-stone-600">{item.cut}</p>
                      </div>
                      <span className="text-brand-dark font-semibold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-card">
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Operativa</p>
                <ul className="mt-3 space-y-2 text-stone-700">
                  <li>• Isporuka sledećeg dana u radijusu 150 km</li>
                  <li>• Vakumirano, označeno i porcionisano</li>
                  <li>• Stalne i ad-hoc narudžbine</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid gap-8 rounded-3xl border border-stone-100 bg-white/70 p-8 shadow-card lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-brand-dark/80">Za šefove kuhinja</p>
              <h2 className="font-display text-3xl font-semibold">Logistika koja prati servis</h2>
              <p className="text-stone-600">
                Poravnati smo sa vašom listom pripreme. Nedeljni rezovi po rasporedu ili posebne
                ture za događaje. Uvek znate težinu, stil obrade i poreklo.
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-stone-700">
                <span className="rounded-full bg-stone-100 px-3 py-1">Porcionirano</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">Označeno po stanici</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">HACCP spremno</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-card">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Hotlajn za šefove</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">+386 (0)31 000 000</p>
                <p className="text-stone-600">Dogovorite degustaciju ili sledeću pripremu.</p>
              </div>
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-card">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">order@mesna.to</p>
                <p className="text-stone-600">Pošaljite porudžbenicu; potvrđujemo u roku od sat vremena.</p>
              </div>
            </div>
          </section>

          <section id="contact" className="relative overflow-hidden rounded-3xl bg-brand text-white shadow-glow">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(243,199,118,0.25),transparent_35%)]" />
            <div className="relative grid gap-6 p-8 sm:grid-cols-[1.1fr_0.9fr] sm:p-10">
              <div className="space-y-3">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">Hajde da pričamo</p>
                <h2 className="font-display text-3xl font-semibold">Spremni za sledeći servis?</h2>
                <p className="text-white/80">
                  Pošaljite listu pripreme ili zatražite degustacioni boks. Preporučićemo rezove,
                  zrenje i pakovanje koje prati vaš način rada.
                </p>
                <div className="flex flex-wrap gap-3 text-sm font-semibold">
                  <a
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-brand shadow hover:-translate-y-0.5"
                    href="mailto:order@mesna.to"
                  >
                    Pišite nam
                  </a>
                  <a
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-3 text-white transition hover:bg-white/10"
                    href="tel:+386031000000"
                  >
                    Pozovite mesara
                  </a>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">Primeri za isti dan</p>
                <ul className="mt-4 space-y-3 text-white">
                  <li>• 1.5 kg pečenica, tanko sečena, spremna za serviranje</li>
                  <li>• 2 kg suvi vrat, narezan za meze</li>
                  <li>• 3 kg dimljena butkica, komad za kuvanje</li>
                  <li>• 1 kg kulen, ploške za posluženje</li>
                </ul>
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6 text-sm text-stone-600">
          <span>mesna.to · Meso za šefove · Spremno za Netlify</span>
          <span>React + Tailwind · Pripremljeno za lansiranje</span>
        </footer>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-stone-900">Korpa</h3>
              <button
                className="rounded-full px-3 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                onClick={() => setIsCartOpen(false)}
                aria-label="Zatvori korpu"
              >
                Zatvori
              </button>
            </div>
            <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {cartItems.length === 0 && <p className="text-sm text-stone-600">Korpa je prazna.</p>}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-stone-900">{item.product.name}</p>
                    <p className="text-sm text-stone-600">
                      {item.grams} g · {item.product.price} · {formatRsd((item.grams / 1000) * parsePriceToNumber(item.product.price))}
                    </p>
                  </div>
                  <button
                    className="text-sm font-semibold text-brand-dark hover:underline"
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Ukloni ${item.product.name}`}
                  >
                    Ukloni
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-stone-700">
              <span>
                Ukupno: {(totalGrams / 1000).toFixed(2)} kg · {formatRsd(totalPrice)}
              </span>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
                onClick={handleCheckoutOpen}
              >
                Nastavi ka narudžbini
              </button>
            </div>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-semibold text-stone-900">Narudžbina</h3>
              <button
                className="rounded-full px-3 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                onClick={() => setIsCheckoutOpen(false)}
                aria-label="Zatvori narudžbinu"
              >
                Zatvori
              </button>
            </div>
            <p className="mt-1 text-sm text-stone-600">Plaćanje pouzećem · Ukupno {formatRsd(totalPrice)}</p>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault()
                setIsThankYou(true)
                setCartItems([])
              }}
            >
              <label className="block text-sm font-semibold text-stone-800">
                Ime i prezime
                <input
                  required
                  name="name"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-brand focus:outline-none"
                  placeholder="Vaše ime"
                />
              </label>
              <label className="block text-sm font-semibold text-stone-800">
                Telefon
                <input
                  required
                  name="phone"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-brand focus:outline-none"
                  placeholder="060 000 000"
                />
              </label>
              <label className="block text-sm font-semibold text-stone-800">
                Adresa za dostavu
                <textarea
                  required
                  name="address"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-brand focus:outline-none"
                  rows={2}
                  placeholder="Ulica, broj, grad"
                />
              </label>
              <label className="block text-sm font-semibold text-stone-800">
                Napomena (opciono)
                <textarea
                  name="note"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-900 focus:border-brand focus:outline-none"
                  rows={2}
                  placeholder="Npr. termin isporuke"
                />
              </label>
              <div className="flex items-center justify-between text-sm text-stone-700">
                <span>Placanje: pouzećem</span>
                <span className="font-semibold text-stone-900">{formatRsd(totalPrice)}</span>
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
              >
                Potvrdi narudžbinu
              </button>
            </form>
            {isThankYou && (
              <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand-dark">
                Hvala! Narudžbina je zabeležena za plaćanje pouzećem. Javićemo vam se za potvrdu termina.
              </div>
            )}
          </div>
        </div>
      )}

      {pendingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-glow">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-stone-900">Dodaj u korpu</h3>
              <button
                className="rounded-full px-3 py-1 text-sm font-semibold text-stone-600 hover:bg-stone-100"
                onClick={() => setPendingProduct(null)}
                aria-label="Zatvori modal dodavanja"
              >
                Zatvori
              </button>
            </div>
            <div className="mt-3 space-y-2 text-sm text-stone-700">
              <p className="font-semibold text-stone-900">{pendingProduct.name}</p>
              <p className="text-stone-600">{pendingProduct.description}</p>
              <p className="font-semibold text-brand-dark">{pendingProduct.price}</p>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-semibold text-stone-800">
                Gramaža
                <select
                  className="mt-1 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-900 shadow-sm focus:border-brand focus:outline-none"
                  value={pendingGrams}
                  onChange={(e) => setPendingGrams(Number(e.target.value))}
                >
                  {gramOptions.map((value) => (
                    <option key={value} value={value}>
                      {value >= 1000 ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 2)} kg` : `${value} g`}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-center justify-between text-sm text-stone-700">
                <span>Ukupno: {formatRsd((pendingGrams / 1000) * parsePriceToNumber(pendingProduct.price))}</span>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5"
                  onClick={() => {
                    confirmAdd()
                    setPendingProduct(null)
                  }}
                >
                  Dodaj u korpu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
