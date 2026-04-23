import type { Rates } from "./tax";

export type FetchRatesResult =
  | { ok: true; rates: Rates; fetchedAt: number }
  | { ok: false; error: string };

/**
 * Free, no-auth endpoint. Returns JSON like:
 * { amount: 1, base: "USD", date: "...", rates: { ILS: 3.71, JOD: 0.709 } }
 */
const PRIMARY = "https://api.frankfurter.app/latest?from=USD&to=ILS,JOD";
const FALLBACK = "https://open.er-api.com/v6/latest/USD";

export async function fetchLiveRates(): Promise<FetchRatesResult> {
  try {
    const res = await fetch(PRIMARY, { cache: "no-store" });
    if (!res.ok) throw new Error(`primary status ${res.status}`);
    const data: { rates?: { ILS?: number; JOD?: number } } = await res.json();
    const usdIls = data.rates?.ILS;
    const usdJod = data.rates?.JOD;
    if (!usdIls || !usdJod) throw new Error("missing rates in primary");
    // 1 JOD in ILS = (USD→ILS) / (USD→JOD)
    const jodIls = usdIls / usdJod;
    return {
      ok: true,
      rates: { usdToIls: round(usdIls, 4), jodToIls: round(jodIls, 4) },
      fetchedAt: Date.now(),
    };
  } catch {
    try {
      const res = await fetch(FALLBACK, { cache: "no-store" });
      if (!res.ok) throw new Error(`fallback status ${res.status}`);
      const data: { rates?: { ILS?: number; JOD?: number } } = await res.json();
      const usdIls = data.rates?.ILS;
      const usdJod = data.rates?.JOD;
      if (!usdIls || !usdJod) throw new Error("missing rates in fallback");
      const jodIls = usdIls / usdJod;
      return {
        ok: true,
        rates: { usdToIls: round(usdIls, 4), jodToIls: round(jodIls, 4) },
        fetchedAt: Date.now(),
      };
    } catch (e) {
      return { ok: false, error: (e as Error).message };
    }
  }
}

function round(n: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}
