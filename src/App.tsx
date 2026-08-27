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
    name: 'Sveže domaće svinjske kobasice',
    slug: 'sveze-domace-svinjske-kobasice',
    cut: 'Sveže meso',
    price: 850,
    origin: 'Srbija',
    badge: 'U prvom planu',
    description: 'Sveže domaće svinjske kobasice sa pažljivo odabranim začinima. Poručite količinu po meri i pripremite ih na svoj način.',
    image: '/kobasice-instagram.jpeg',
    alt: 'mesna.to sveže domaće svinjske kobasice u vakumiranom pakovanju',
  },
  {
    name: 'Domaća slanina',
    slug: 'domaca-slanina',
    cut: 'Suhomesnato',
    price: 1400,
    origin: 'Srbija',
    description: 'Domaća slanina sa punim ukusom i prijatnim odnosom mesa i masnoće. Jedini suhomesnati proizvod trenutno u ponudi.',
    image: '/slanina-instagram.jpeg',
    alt: 'mesna.to domaća slanina u vakumiranom pakovanju',
  },
]

const gramOptions = [
  100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000,
  9000, 10000,
]

const faqItems = [
  {
    question: 'Šta može da se poruči na mesna.to?',
    answer:
      'U aktuelnoj ponudi su sveže domaće svinjske kobasice i domaća slanina. Slanina je trenutno jedini suhomesnati proizvod. Poreklo proizvoda je Srbija.',
  },
  {
    question: 'Kako se poručuju mesna.to proizvodi?',
    answer:
      'Izaberite proizvod, zatim gramažu i dodajte ga u korpu. U korpi proverite narudžbinu i unesite ime, telefon i adresu za isporuku.',
  },
  {
    question: 'Koja je najmanja količina za poručivanje?',
    answer:
      'Najmanja ponuđena količina je 100 grama. Dostupne opcije, od 100 grama do 10 kilograma, videćete kada kliknete na „Izaberi“.',
  },
  {
    question: 'Kako se plaća narudžbina?',
    answer: 'Plaćanje se vrši pouzećem, prilikom preuzimanja narudžbine.',
  },
  {
    question: 'Da li su cene prikazane po kilogramu?',
    answer:
      'Da. Na svakoj kartici proizvoda označena je cena za jedan kilogram, a korpa automatski računa iznos za izabranu gramažu.',
  },
  {
    question: 'Da li je potrebna registracija za kupovinu?',
    answer:
      'Nije. Proizvode možete dodati u korpu i poslati narudžbinu bez otvaranja korisničkog naloga.',
  },
  {
    question: 'Koje je najbolje domaće meso za meze, a koje za kuvanje?',
    answer:
      'Za brzo pečenje i roštilj birajte sveže domaće svinjske kobasice, a za meze domaću slaninu. Najbolji izbor zavisi od jela koje pripremate i ukusa koji želite.',
  },
  {
    question: 'Ko proizvodi mesna.to proizvode i gde?',
    answer:
      'mesna.to je proizvođač. Sveže kobasice i slanina pripremaju se u kućnoj proizvodnji na Umci, od sertifikovanog mesa.',
  },
  {
    question: 'Kakav je sastav i da li proizvodi sadrže aditive?',
    answer:
      'Proizvodi ne sadrže aditive. U kobasicama se koriste meso, so i odabrani začini, dok slanina ima jednostavan sastav od mesa i soli.',
  },
  {
    question: 'Kada se obavlja dostava?',
    answer:
      'Termin dostave dogovara se nakon poručivanja i zavisi od svežine mesa u konkretnoj narudžbini. mesna.to kontaktira kupca radi potvrde i dogovora.',
  },
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
        Kućna proizvodnja na Umci <span className="mx-2 text-gold">•</span> Sertifikovano meso
        <span className="mx-2 text-gold">•</span> Bez aditiva
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
            <a href="#vodic" className="nav-link">Vodič</a>
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
                Sveže domaće svinjske kobasice <span className="text-brand">za pravu trpezu.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
                mesna.to priprema sveže domaće svinjske kobasice na Umci, od sertifikovanog mesa i
                bez aditiva. Trenutno je u ponudi i domaća slanina, a termin dostave dogovaramo sa vama.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#ponuda" className="button-primary">
                  Pogledaj ponudu
                  <ArrowIcon />
                </a>
                <a href="#kako-poruciti" className="button-secondary">Kako funkcioniše?</a>
              </div>
              <ul className="mt-9 grid gap-3 text-sm font-semibold text-stone-700 sm:grid-cols-3" aria-label="Prednosti kupovine">
                {['Proizvođač mesna.to', 'Od 100 g do 10 kg', 'Plaćanje pouzećem'].map((item) => (
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
                  src="/kobasice-instagram.jpeg"
                  alt="mesna.to sveže domaće svinjske kobasice u vakumiranom pakovanju"
                  width="920"
                  height="900"
                  fetchPriority="high"
                  className="h-[420px] w-full object-cover sm:h-[560px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">U prvom planu</p>
                    <p className="mt-1 font-display text-3xl font-semibold">Sveže domaće kobasice</p>
                    <p className="mt-1 text-sm text-white/75">Tradicionalni ukus, spremne za roštilj</p>
                  </div>
                  <p className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-stone-900">
                    {formatRsd(850)} / kg
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-7 -left-3 hidden w-48 rotate-[-4deg] rounded-2xl border border-white/80 bg-white p-3 shadow-xl sm:block">
                <img src="/slanina-instagram.jpeg" alt="Domaća slanina" width="200" height="120" className="h-24 w-full rounded-xl object-cover" />
                <p className="mt-2 text-center text-xs font-extrabold text-stone-800">Za meze: domaća slanina.</p>
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
                Sveže kobasice su u prvom planu, uz domaću slaninu kao jedini suhomesnati proizvod. Jasna cena po kilogramu, količina po vašoj meri i jednostavno online poručivanje.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} onOpen={() => openProduct(product)} />
              ))}
            </div>

            <div className="mt-14 overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-50">
              <div className="border-b border-stone-200 px-5 py-5 sm:px-7">
                <h3 className="font-display text-2xl font-semibold text-stone-900">Aktuelna ponuda i cene</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Sve cene su u dinarima za jedan kilogram. Konačan iznos zavisi od izabrane gramaže.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                  <caption className="sr-only">Poređenje mesna.to proizvoda, cena, porekla i namene</caption>
                  <thead className="bg-stone-100 text-xs uppercase tracking-wider text-stone-500">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-bold sm:px-7">Proizvod</th>
                      <th scope="col" className="px-5 py-3 font-bold">Vrsta</th>
                      <th scope="col" className="px-5 py-3 font-bold">Poreklo</th>
                      <th scope="col" className="px-5 py-3 text-right font-bold sm:px-7">Cena / kg</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {products.map((product) => (
                      <tr key={`summary-${product.slug}`}>
                        <th scope="row" className="px-5 py-4 font-extrabold text-stone-900 sm:px-7">
                          <a href={`#${product.slug}`} className="hover:text-brand hover:underline">{product.name}</a>
                        </th>
                        <td className="px-5 py-4 text-stone-600">{product.cut}</td>
                        <td className="px-5 py-4 text-stone-600">{product.origin}</td>
                        <td className="px-5 py-4 text-right font-extrabold text-stone-900 sm:px-7">
                          {formatRsd(product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section id="vodic" className="scroll-mt-28 border-b border-stone-200 bg-cream py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow justify-center">Vodič za izbor</p>
              <h2 className="section-title">Kako izabrati najbolje domaće meso?</h2>
              <p className="section-copy">
                Sveže domaće kobasice su odlične za roštilj i tiganj, dok slanina donosi pun ukus
                domaćeg mesa na dasku za meze i u tradicionalna jela. Izbor počinje od prilike za
                koju pripremate obrok.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">Za roštilj</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">Sveže domaće svinjske kobasice</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Kobasice su sveže i spremne za pečenje. Napravite ih na roštilju, u tiganju ili
                  u rerni i poslužite uz prilog po izboru.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">Za meze</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">Domaća slanina</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Slanina je trenutno jedini suhomesnati proizvod u ponudi. Isecite je tanko za
                  meze ili je upotrebite kao dodatak kuvanim i pečenim jelima.
                </p>
              </article>
              <article className="rounded-[1.75rem] border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">Za svaki dan</p>
                <h3 className="mt-3 font-display text-2xl font-semibold">Količina po vašoj meri</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Izaberite od 100 g do 10 kg. Kobasice su 850 RSD/kg, a tačan iznos za izabranu
                  količinu vidite odmah u korpi.
                </p>
              </article>
            </div>
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-brand/15 bg-brand/5 p-5 text-sm leading-7 text-stone-700 sm:p-6">
              <strong className="text-stone-900">Gde kupiti domaće meso online?</strong>{' '}
              Na mesna.to birate proizvod i količinu od 100 g do 10 kg, cenu vidite pre slanja
              narudžbine, a plaćate pouzećem. Sveže kobasice i domaća slanina u aktuelnoj ponudi imaju navedeno poreklo iz Srbije.
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
                  ['03', 'Dogovorite dostavu', 'Javljamo vam se radi potvrde i termina koji zavisi od svežine mesa.'],
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
                src="/kobasice-instagram-detail.jpeg"
                alt="Sveže domaće svinjske kobasice iz mesna.to ponude"
                loading="lazy"
                width="500"
                height="650"
                className="h-72 w-full rounded-[1.75rem] object-cover sm:h-[420px]"
              />
              <img
                src="/slanina-instagram.jpeg"
                alt="Domaća slanina iz mesna.to ponude"
                loading="lazy"
                width="500"
                height="650"
                className="mt-10 h-72 w-full rounded-[1.75rem] object-cover sm:h-[420px]"
              />
            </div>
            <div>
              <p className="eyebrow !text-gold">Šta je mesna.to?</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                Sveže kobasice i slanina iz kućne proizvodnje na Umci.
              </h2>
              <p className="mt-6 text-base leading-8 text-white/70 sm:text-lg">
                mesna.to je proizvođač svežih domaćih svinjskih kobasica i domaće slanine. Proizvode
                pripremamo u kućnoj proizvodnji na Umci, od sertifikovanog mesa i bez aditiva. U
                kobasicama ukus daju odabrani začini, a slanina se priprema sa jednostavnim sastavom.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-extrabold">Kućna proizvodnja na Umci</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">mesna.to priprema proizvode u maloj, kućnoj proizvodnji.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-extrabold">Bez aditiva</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">Jednostavan sastav: meso, so i odabrani začini.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-extrabold">Sertifikovano meso</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">Za proizvodnju se koristi sertifikovano meso.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-extrabold">Dostava po dogovoru</p>
                  <p className="mt-1 text-sm leading-6 text-white/60">Termin zavisi od svežine mesa u vašoj narudžbini.</p>
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
              <p className="section-copy">
                Ukratko: mesna.to priprema sveže domaće svinjske kobasice i domaću slaninu bez aditiva
                na Umci, od sertifikovanog mesa, uz izbor količine i dostavu po dogovoru.
              </p>
            </div>
            <div className="mt-10 divide-y divide-stone-200 border-y border-stone-200">
              {faqItems.map(({ question, answer }) => (
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
                <p className="text-sm text-white/55">Kućna proizvodnja bez aditiva na Umci</p>
              </div>
            </a>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/70" aria-label="Navigacija u podnožju">
              <a href="#ponuda" className="hover:text-white">Ponuda</a>
              <a href="#vodic" className="hover:text-white">Vodič za izbor</a>
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
                <p className="text-center text-xs leading-5 text-stone-500">Kontaktiraćemo vas radi potvrde i dogovora o terminu, koji zavisi od svežine mesa.</p>
              </form>
            ) : (
              <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white"><CheckIcon /></span>
                <h3 className="mt-4 text-lg font-extrabold text-emerald-950">Hvala na narudžbini!</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-800">Narudžbina je uspešno zabeležena. Javićemo vam se radi potvrde i dogovora o dostavi.</p>
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
