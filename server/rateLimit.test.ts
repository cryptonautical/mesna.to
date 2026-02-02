import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, getRateLimitStatus, resetRateLimit } from "./_core/rateLimit";

describe("Rate Limiting", () => {
  const testIp = "192.168.1.1";

  beforeEach(() => {
    // Resetuj rate limit pre svakog testa
    resetRateLimit(testIp);
  });

  it("allows first request", () => {
    const result = checkRateLimit(testIp);
    expect(result).toBe(true);
  });

  it("allows multiple requests within limit", () => {
    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(testIp);
      expect(result).toBe(true);
    }
  });

  it("blocks requests after limit is exceeded", () => {
    // Napravi 5 zahteva (limit)
    for (let i = 0; i < 5; i++) {
      checkRateLimit(testIp);
    }

    // 6. zahtev bi trebao biti blokiran
    const result = checkRateLimit(testIp);
    expect(result).toBe(false);
  });

  it("returns correct rate limit status", () => {
    checkRateLimit(testIp);
    const status = getRateLimitStatus(testIp);

    expect(status.remaining).toBe(4); // 5 - 1 = 4
    expect(status.isLimited).toBe(false);
  });

  it("marks as limited when max requests reached", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit(testIp);
    }

    const status = getRateLimitStatus(testIp);
    expect(status.remaining).toBe(0);
    expect(status.isLimited).toBe(true);
  });

  it("different IPs have separate limits", () => {
    const ip1 = "192.168.1.1";
    const ip2 = "192.168.1.2";

    // Napravi 5 zahteva sa ip1
    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip1);
    }

    // ip1 bi trebao biti limitiran
    expect(checkRateLimit(ip1)).toBe(false);

    // ip2 bi trebao biti dozvoljen
    expect(checkRateLimit(ip2)).toBe(true);
  });

  it("resets rate limit for specific IP", () => {
    // Napravi 5 zahteva
    for (let i = 0; i < 5; i++) {
      checkRateLimit(testIp);
    }

    // Trebao bi biti limitiran
    expect(checkRateLimit(testIp)).toBe(false);

    // Resetuj
    resetRateLimit(testIp);

    // Trebao bi biti dozvoljen
    expect(checkRateLimit(testIp)).toBe(true);
  });
});
