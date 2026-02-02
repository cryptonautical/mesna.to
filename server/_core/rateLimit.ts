/**
 * Rate limiting za zaštitu od spam-a
 * Ograničava broj narudžbina po IP adresi
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store za rate limiting (u produkciji koristiti Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Konfiguracija rate limiting-a
const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS: 5, // Maksimalno 5 narudžbina
  WINDOW_MS: 60 * 60 * 1000, // U periodu od 1 sata
  CLEANUP_INTERVAL: 30 * 60 * 1000, // Očisti stare entries svakih 30 minuta
};

// Očisti stare entries periodično
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  rateLimitStore.forEach((value, key) => {
    if (value.resetTime < now) {
      keysToDelete.push(key);
    }
  });
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}, RATE_LIMIT_CONFIG.CLEANUP_INTERVAL);

/**
 * Proverava da li je IP adresa prekoračila rate limit
 * @param ip - IP adresa korisnika
 * @returns true ako je dozvoljeno, false ako je prekoračen limit
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // Prvi zahtev sa ove IP adrese
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
    });
    return true;
  }

  if (now > entry.resetTime) {
    // Prozor je istekao, resetuj counter
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
    });
    return true;
  }

  // Proveri da li je prekoračen limit
  if (entry.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS) {
    return false;
  }

  // Inkrementuj counter
  entry.count++;
  return true;
}

/**
 * Vraća informacije o trenutnom rate limit statusu
 * @param ip - IP adresa korisnika
 * @returns Objekat sa informacijama o rate limit-u
 */
export function getRateLimitStatus(ip: string) {
  const entry = rateLimitStore.get(ip);
  const now = Date.now();

  if (!entry) {
    return {
      remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
      isLimited: false,
    };
  }

  if (now > entry.resetTime) {
    return {
      remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS,
      resetTime: now + RATE_LIMIT_CONFIG.WINDOW_MS,
      isLimited: false,
    };
  }

  return {
    remaining: Math.max(0, RATE_LIMIT_CONFIG.MAX_REQUESTS - entry.count),
    resetTime: entry.resetTime,
    isLimited: entry.count >= RATE_LIMIT_CONFIG.MAX_REQUESTS,
  };
}

/**
 * Resetuj rate limit za određenu IP adresu (za admin)
 * @param ip - IP adresa korisnika
 */
export function resetRateLimit(ip: string): void {
  rateLimitStore.delete(ip);
}
