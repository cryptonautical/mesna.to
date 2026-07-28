import { useEffect, useMemo, useState } from 'react'

type Product = {
  name: string
  slug: string
  cut: string
  price: number
  origin: string
  badge?: string
  description: string
  image: string
  alt: string
}

type CartItem = {
  id: string
  product: Product
  grams: number
}

const formatRsd = (value: number) =>
  new Intl.NumberFormat('sr-Latn-RS', {
    style: 'currency',
    currency: 'RSD',
    maximumFractionDigits: 0,
  }).format(value)

const formatWeight = (grams: number) =>
  grams >= 1000 ? `${(grams / 1000).toLocaleString('sr-Latn-RS')} kg` : `${grams} g`

const products: Product[] = [
  {
    name: 'Suvi vrat',
    slug: 'suvi-vrat',
    cut: 'Suvo meso',
    price: 1500,
    origin: 'Srbija',
    badge: 'Najtraženije',
    description: 'Sočan suvi vrat punog, zaokruženog ukusa. Odličan za meze, sendviče i posluženja.',
    image: '/vrat.jpeg',
    alt: 'mesna.to domaći suvi vrat, isečen i spreman za posluženje',
  },
  {
    name: 'Pečenica',
    slug: 'pecenica',
    cut: 'Suvo meso',
    price: 1500,
    origin: 'Srbija',
    description: 'Pečenica od pažljivo odabranog mesa, blagog mirisa dima i prijatne teksture.',
    image: '/pecenica.jpeg',
    alt: 'mesna.to domaća suva pečenica u komadu',
  },
  {
    name: 'Dimljena butkica',
    slug: 'dimljena-butkica',
    cut: 'Dimljeno meso',
    price: 850,
    origin: 'Srbija',
    description: 'Dimljena butkica za sporo kuvanje, pasulj i bogata tradicionalna jela.',
    image: '/butkica.jpeg',
    alt: 'mesna.to dimljena svinjska butkica vakumirana za isporuku',
  },
  {
    name: 'Dimljena kolenica',
    slug: 'dimljena-kolenica',
    cut: 'Dimljeno meso',
    price: 850,
    origin: 'Srbija',
    description: 'Mesnata dimljena kolenica izraženog ukusa, spremna za vaša omiljena kuvana jela.',
    image: '/kolenica.jpeg',
    alt: 'mesna.to domaća dimljena svinjska kolenica',
  },
  {
    name: 'Sušeni but',
    slug: 'suseni-but',
    cut: 'Suvo meso',
    price: 1500,
    origin: 'Srbija',
    description: 'Sušeni svinjski but čvrste teksture i punog ukusa, za bogatu dasku sa mezom.',
    image: '/but.jpeg',
    alt: 'mesna.to sušeni svinjski but na drvenoj dasci',
  },
  {
    name: 'Domaća mast',
    slug: 'domaca-mast',
    cut: 'Tradicionalno',
    price: 250,
    origin: 'Srbija',
    description: 'Domaća svinjska mast za kuvanje, pečenje ili jednostavno posluženje na toplom hlebu.',
    image: '/mast.jpg',
    alt: 'mesna.to bela domaća svinjska mast u drvenoj posudi',
  },
]

const gramOptions = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
  9000, 10000,
]

const ArrowIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4">
    <path d="M4 10h12m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const BagIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M6.8 8.5h10.4l1 11H5.8l1-11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
)

const CloseIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
    <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const CheckIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
    <path d="m4 10.5 3.5 3.5L16 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  return (
    <article
      id={product.slug}
      className="product-card group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-stone-200/80 bg-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          width="720"
          height="540"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
          {product.badge ? (
            <span className="rounded-full bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              {product.badge}
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-stone-700 backdrop-blur">
            {product.origin}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{product.cut}</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-stone-900">{product.name}</h3>
        <p className="mt-2 min-h-[3rem] text-sm leading-6 text-stone-600">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-stone-100 pt-4">
          <div>
            <p className="text-xs text-stone-500">Cena po kilogramu</p>
            <p className="text-xl font-extrabold text-stone-900">{formatRsd(product.price)}</p>
          </div>
          <button type="button" className="button-primary !px-4 !py-2.5" onClick={onOpen}>
            Izaberi
            <ArrowIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isThankYou, setIsThankYou] = useState(false)
  const [isSendingOrder, setIsSendingOrder] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null)
  const [pendingGrams, setPendingGrams] = useState(500)
  const [addedMessage, setAddedMessage] = useState('')

  const totalGrams = useMemo(() => cartItems.reduce((sum, item) => sum + item.grams, 0), [cartItems])
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.grams / 1000) * item.product.price, 0),
    [cartItems],
  )

  const isOverlayOpen = Boolean(pendingProduct) || isCartOpen || isCheckoutOpen

  useEffect(() => {
    if (!isOverlayOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPendingProduct(null)
        setIsCartOpen(false)
        setIsCheckoutOpen(false)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOverlayOpen])

  useEffect(() => {
    if (!addedMessage) return
    const timeout = window.setTimeout(() => setAddedMessage(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [addedMessage])

  const openProduct = (product: Product) => {
    setPendingProduct(product)
    setPendingGrams(product.price <= 300 ? 1000 : 500)
  }

  const confirmAdd = () => {
    if (!pendingProduct) return
    const name = pendingProduct.name
    setCartItems((current) => [
      ...current,
      { id: crypto.randomUUID(), product: pendingProduct, grams: pendingGrams },
    ])
    setPendingProduct(null)
    setAddedMessage(`${name} je dodat u korpu.`)
  }

  const handleCheckoutOpen = () => {
    if (cartItems.length === 0) return
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
    setIsThankYou(false)
    setSendError(null)
  }

  const handleSubmitOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cartItems.length === 0) {
      setSendError('Korpa je prazna. Dodajte proizvod pre slanja narudžbine.')
      return
    }

    setIsThankYou(false)
    setSendError(null)
    setIsSendingOrder(true)
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      customer: {
        name: String(formData.get('name') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        address: String(formData.get('address') ?? ''),
        note: String(formData.get('note') ?? ''),
      },
      cart: cartItems.map((item) => ({
        name: item.product.name,
        grams: item.grams,
        price: `${item.product.price} RSD`,
      })),
      totals: { grams: totalGrams, price: formatRsd(totalPrice) },
    }

    try {
      const response = await fetch('/.netlify/functions/order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Slanje narudžbine trenutno nije uspelo.')
      }
      setIsThankYou(true)
      setCartItems([])
      form.reset()
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Slanje narudžbine trenutno nije uspelo.')
    } finally {
      setIsSendingOrder(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-cream text-stone-900">
      <a href="#main-content" className="skip-link">Pređi na glavni sadržaj</a>

      <div className="bg-stone-900 px-4 py-2.5 text-center text-xs font-semibold tracking-wide text-white sm:text-sm">
        Domaći proizvodi iz Srbije <span className="mx-2 text-gold">•</span> Poručivanje po gramaži
        <span className="mx-2 text-gold">•</span> Plaćanje pouzećem
      </div>

      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-cream/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="mesna.to početna stranica">
            <img src="/logo.png" alt="" width="52" height="52" className="h-12 w-12 object-contain" />
            <div className="leading-none">
              <span className="block font-display text-2xl font-bold tracking-tight text-stone-900">
                mesna<span className="text-brand">.to</span>
              </span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                Ukus domaćeg
              </span>
            </div>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-bold text-stone-700 md:flex" aria-label="Glavna navigacija">
            <a href="#ponuda" className="nav-link">Ponuda</a>
            <a href="#kako-poruciti" className="nav-link">Kako poručiti</a>
            <a href="#o-nama" className="nav-link">O nama</a>
            <a href="#pitanja" className="nav-link">Pitanja</a>
          </nav>

          <button
            type="button"
            className="relative inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Otvori korpu, ${cartItems.length} stavki`}
          >
            <BagIcon />
            <span className="hidden sm:inline">Korpa</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] text-white">
              {cartItems.length}
            </span>
          </button>
        </div>
      </header>

      <main id="main-content">
        <section className="relative">
          <div className="hero-orb hero-orb-left" aria-hidden="true" />
          <div className="hero-orb hero-orb-right" aria-hidden="true" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20">
            <div className="relative z-10">
              <p className="eyebrow">mesna.to · domaći ukus na klik</p>
              <h1 className="mt-5 max-w-3xl font-display text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.03em] text-stone-900 sm:text-6xl lg:text-[4.5rem]">
                Suvo i dimljeno meso <span className="text-brand">za pravu trpezu.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                mesna.to donosi odabrane domaće proizvode direktno do vas. Izaberite proizvod i
                gramažu, a narudžbinu platite pouzećem.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#ponuda" className="button-primary">
                  Pogledaj ponudu
                  <ArrowIcon />
                </a>
                <a href="#kako-poruciti" className="button-secondary">Kako funkcioniše?</a>
              </div>
              <ul className="mt-9 grid gap-3 text-sm font-semibold text-stone-700 sm:grid-cols-3" aria-label="Prednosti kupovine">
                {['Poreklo iz Srbije', 'Od 100 g do 10 kg', 'Plaćanje pouzećem'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <CheckIcon />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
              <div className="relative overflow-hidden rounded-[2rem] bg-stone-900 shadow-2xl sm:rounded-[2.5rem]">
                <img
                  src="/vrat.jpeg"
                  alt="mesna.to domaći suvi vrat pripremljen za meze"
                  width="920"
                  height="900"
                  fetchPriority="high"
                  className="h-[420px] w-full object-cover sm:h-[560px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Najtraženije</p>
                    <p className="mt-1 font-display text-3xl font-semibold">Suvi vrat</p>
                    <p className="mt-1 text-sm text-white/75">Pun ukus domaćeg mesa</p>
                  </div>
                  <p className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-stone-900">
                    {formatRsd(1500)} / kg
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-7 -left-3 hidden w-48 rotate-[-4deg] rounded-2xl border border-white/80 bg-white p-3 shadow-xl sm:block">
                <img src="/mast.jpg" alt="" width="200" height="120" className="h-24 w-full rounded-xl object-cover" />
                <p className="mt-2 text-center text-xs font-extrabold text-stone-800">I nešto za na hleb.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="ponuda" className="scroll-mt-28 border-y border-stone-200 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow justify-center">mesna.to ponuda</p>
              <h2 className="section-title">Odaberite ukus domaćeg</h2>
              <p className="section-copy">
                Jasna cena po kilogramu, količina po vašoj meri i jednostavno online poručivanje.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} onOpen={() => openProduct(product)} />
              ))}
            </div>
          </div>
        </section>

        <section id="kako-poruciti" className="scroll-mt-28 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="eyebrow">Jednostavna kupovina</p>
                <h2 className="section-title !mt-4">Od ponude do trpeze u tri koraka</h2>
                <p className="section-copy !mx-0 !text-left">
                  Bez registracije i komplikovanih formulara. Sve što vam treba završavate na jednom mestu.
                </p>
              </div>
              <ol className="grid gap-4 sm:grid-cols-3">
                {[
                  ['01', 'Izaberite', 'Odaberite proizvod i željenu gramažu.'],
                  ['02', 'Unesite podatke', 'Ostavite kontakt i adresu za dostavu.'],
                  ['03', 'Sačekajte potvrdu', 'Javljamo vam se radi potvrde narudžbine i termina.'],
                ].map(([number, title, text]) => (
                  <li key={number} className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm">
                    <span className="font-display text-4xl font-bold text-brand/25">{number}</span>
                    <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="o-nama" className="scroll-mt-28 bg-stone-900 py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
            <div className="grid grid-cols-2 gap-3">
              <img
                src="/pecenica.jpeg"
                alt="Domaća suva pečenica iz mesna.to ponude"
                loading="lazy"
                width="500"
                height="650"
                className="h-72 w-full rounded-[1.75rem] object-cover sm:h-[420px]"
              />
              <img
                src="/but.jpeg"
                alt="Domaći sušeni but iz mesna.to ponude"
                loading="lazy"
                width="500"
                height="650"
                className="mt-10 h-72 w-full rounded-[1.75rem] object-cover sm:h-[420px]"
              />
            </div>
            <div>
              <p className="eyebrow !text-gold">Šta je mesna.to?</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Domaći proizvodi, predstavljeni bez komplikovanja.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70 sm:text-lg">
                mesna.to je online mesto za ljubitelje suvog i dimljenog svinjskog mesa. Naša ponuda
                okuplja prepoznatljive ukuse domaće trpeze — od suvog vrata i pečenice do dimljene
                kolenice i domaće masti.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-extrabold">Količina po meri</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">Poručite tačno onoliko koliko vam je potrebno.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-extrabold">Jasna ponuda</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">Fotografija, opis i cena svakog proizvoda.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pitanja" className="scroll-mt-28 bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <p className="eyebrow justify-center">Česta pitanja</p>
              <h2 className="section-title">Sve o mesna.to poručivanju</h2>
            </div>
            <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
              {[
                ['Kako se poručuju mesna.to proizvodi?', 'Izaberite proizvod, zatim gramažu i dodajte ga u korpu. U korpi proverite narudžbinu i unesite podatke za isporuku.'],
                ['Koja je najmanja količina za poručivanje?', 'Za većinu proizvoda možete izabrati količinu već od 100 grama. Dostupne opcije videćete nakon što kliknete na „Izaberi“.'],
                ['Kako se plaća narudžbina?', 'Plaćanje se vrši pouzećem, prilikom preuzimanja narudžbine.'],
                ['Da li su cene prikazane po kilogramu?', 'Da. Na svakoj kartici proizvoda jasno je označena cena za jedan kilogram, a korpa automatski računa iznos za izabranu gramažu.'],
              ].map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-extrabold text-stone-900">
                    {question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xl text-brand transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pt-3 text-sm leading-7 text-stone-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-800 bg-stone-900 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <a href="#" className="flex items-center gap-3" aria-label="mesna.to početna stranica">
              <img src="/logo.png" alt="" width="56" height="56" className="h-14 w-14 object-contain" />
              <div>
                <p className="font-display text-2xl font-bold">mesna<span className="text-brand-light">.to</span></p>
                <p className="text-sm text-white/55">Domaće suvo i dimljeno meso</p>
              </div>
            </a>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/70" aria-label="Navigacija u podnožju">
              <a href="#ponuda" className="hover:text-white">Ponuda</a>
              <a href="#kako-poruciti" className="hover:text-white">Kako poručiti</a>
              <a href="#o-nama" className="hover:text-white">O nama</a>
              <a href="#pitanja" className="hover:text-white">Česta pitanja</a>
            </nav>
          </div>
          <div className="flex flex-col justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
            <p>© {new Date().getFullYear()} mesna.to. Sva prava zadržana.</p>
            <p>mesna.to · Ukus domaćeg</p>
          </div>
        </div>
      </footer>

      {addedMessage && (
        <div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-bold text-white shadow-2xl" role="status">
          <span className="text-gold"><CheckIcon /></span>
          {addedMessage}
        </div>
      )}

      {pendingProduct && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setPendingProduct(null)}>
          <div
            className="dialog-panel max-w-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="dialog-close" onClick={() => setPendingProduct(null)} aria-label="Zatvori">
              <CloseIcon />
            </button>
            <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
              <img src={pendingProduct.image} alt={pendingProduct.alt} className="h-56 w-full object-cover sm:h-full" />
              <div className="p-6 sm:p-8">
                <p className="eyebrow">{pendingProduct.cut}</p>
                <h2 id="product-dialog-title" className="mt-3 font-display text-3xl font-semibold">{pendingProduct.name}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{pendingProduct.description}</p>
                <p className="mt-4 text-sm text-stone-500">
                  Cena: <strong className="text-stone-900">{formatRsd(pendingProduct.price)} / kg</strong>
                </p>
                <label className="mt-6 block text-sm font-extrabold text-stone-800">
                  Izaberite količinu
                  <select
                    className="form-control mt-2"
                    value={pendingGrams}
                    onChange={(event) => setPendingGrams(Number(event.target.value))}
                    autoFocus
                  >
                    {gramOptions.map((value) => (
                      <option key={value} value={value}>{formatWeight(value)}</option>
                    ))}
                  </select>
                </label>
                <div className="mt-6 rounded-2xl bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-stone-600">Ukupno</span>
                    <strong className="text-xl">{formatRsd((pendingGrams / 1000) * pendingProduct.price)}</strong>
                  </div>
                </div>
                <button type="button" className="button-primary mt-4 w-full" onClick={confirmAdd}>
                  <BagIcon /> Dodaj u korpu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="dialog-backdrop !items-stretch !justify-end !p-0" role="presentation" onMouseDown={() => setIsCartOpen(false)}>
          <aside
            className="flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl sm:p-7"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Vaša narudžbina</p>
                <h2 id="cart-title" className="mt-1 font-display text-3xl font-semibold">Korpa</h2>
              </div>
              <button type="button" className="dialog-close !static" onClick={() => setIsCartOpen(false)} aria-label="Zatvori korpu">
                <CloseIcon />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400"><BagIcon /></span>
                  <p className="mt-4 font-extrabold">Korpa je prazna</p>
                  <p className="mt-1 max-w-60 text-sm text-stone-500">Izaberite domaći proizvod i količinu koja vam odgovara.</p>
                  <button type="button" className="button-secondary mt-5" onClick={() => setIsCartOpen(false)}>Pogledaj ponudu</button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl border border-stone-200 p-3">
                    <img src={item.product.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-extrabold">{item.product.name}</p>
                        <button
                          type="button"
                          className="text-xs font-bold text-brand hover:underline"
                          onClick={() => setCartItems((current) => current.filter((entry) => entry.id !== item.id))}
                          aria-label={`Ukloni ${item.product.name} iz korpe`}
                        >
                          Ukloni
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-stone-500">{formatWeight(item.grams)}</p>
                      <p className="mt-2 text-sm font-extrabold">{formatRsd((item.grams / 1000) * item.product.price)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-stone-200 pt-5">
                <div className="flex items-center justify-between text-sm text-stone-600">
                  <span>Ukupna količina</span><span>{formatWeight(totalGrams)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-extrabold">Ukupno</span><span className="text-2xl font-extrabold">{formatRsd(totalPrice)}</span>
                </div>
                <p className="mt-2 text-xs text-stone-500">Plaćanje pouzećem</p>
                <button type="button" className="button-primary mt-5 w-full" onClick={handleCheckoutOpen}>
                  Nastavi ka narudžbini <ArrowIcon />
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setIsCheckoutOpen(false)}>
          <div
            className="dialog-panel max-w-lg p-6 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="dialog-close" onClick={() => setIsCheckoutOpen(false)} aria-label="Zatvori">
              <CloseIcon />
            </button>
            <p className="eyebrow">Poslednji korak</p>
            <h2 id="checkout-title" className="mt-2 font-display text-3xl font-semibold">Podaci za narudžbinu</h2>
            <p className="mt-2 text-sm text-stone-600">
              {formatWeight(totalGrams)} · <strong className="text-stone-900">{formatRsd(totalPrice)}</strong> · plaćanje pouzećem
            </p>

            {!isThankYou ? (
              <form className="mt-6 space-y-4" onSubmit={handleSubmitOrder}>
                <label className="form-label">
                  Ime i prezime
                  <input required autoComplete="name" name="name" className="form-control" placeholder="Vaše ime i prezime" />
                </label>
                <label className="form-label">
                  Telefon
                  <input required autoComplete="tel" inputMode="tel" name="phone" className="form-control" placeholder="060 000 000" />
                </label>
                <label className="form-label">
                  Adresa za dostavu
                  <textarea required autoComplete="street-address" name="address" className="form-control resize-none" rows={2} placeholder="Ulica, broj i grad" />
                </label>
                <label className="form-label">
                  Napomena <span className="font-normal text-stone-400">(opciono)</span>
                  <textarea name="note" className="form-control resize-none" rows={2} placeholder="Termin ili dodatna napomena" />
                </label>
                {sendError && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{sendError}</p>}
                <button type="submit" className="button-primary w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={isSendingOrder}>
                  {isSendingOrder ? 'Šaljemo narudžbinu…' : `Potvrdi · ${formatRsd(totalPrice)}`}
                </button>
                <p className="text-center text-xs leading-5 text-stone-500">Kontaktiraćemo vas radi potvrde narudžbine i termina isporuke.</p>
              </form>
            ) : (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckIcon /></span>
                <h3 className="mt-4 text-lg font-extrabold text-emerald-950">Hvala na narudžbini!</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-800">Narudžbina je uspešno zabeležena. Javićemo vam se radi potvrde.</p>
                <button type="button" className="button-secondary mt-5" onClick={() => setIsCheckoutOpen(false)}>Završi</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
