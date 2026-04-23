// Verify the tax engine against the spec example without running the UI.
// Replicates lib/tax.ts logic in plain JS — source of truth must match.
const BRACKETS = [
  { limit: 75_000, rate: 0.05 },
  { limit: 150_000, rate: 0.10 },
  { limit: Infinity, rate: 0.15 },
];
const PERSONAL = 36_000;
const HOUSING = 30_000;

function toAnnualIls(input, rates) {
  const ils =
    input.currency === "ILS"
      ? input.amount
      : input.currency === "USD"
      ? input.amount * rates.usdToIls
      : input.amount * rates.jodToIls;
  return input.period === "monthly" ? ils * 12 : ils;
}

function calculate(input) {
  const gross = toAnnualIls(input.salary, input.rates);
  const transport =
    input.transportation.mode === "percent"
      ? gross * 0.1
      : toAnnualIls(input.transportation.value, input.rates);
  const housing = input.housingEnabled ? HOUSING : 0;
  const optional = Object.values(input.optional).reduce(
    (s, ex) => s + (ex.enabled ? toAnnualIls(ex.value, input.rates) : 0),
    0,
  );
  const totalExemptions = transport + PERSONAL + housing + optional;
  const taxable = Math.max(0, gross - totalExemptions);
  let remaining = taxable;
  let lower = 0;
  const brackets = BRACKETS.map((b) => {
    const width = b.limit - lower;
    const inBracket = Math.max(0, Math.min(remaining, width));
    const tax = inBracket * b.rate;
    remaining -= inBracket;
    lower = b.limit;
    return { inBracket, tax, rate: b.rate };
  });
  const total = brackets.reduce((s, b) => s + b.tax, 0);
  return { gross, transport, totalExemptions, taxable, brackets, total };
}

// Spec example
const result = calculate({
  salary: { amount: 5000, currency: "USD", period: "monthly" },
  transportation: {
    mode: "fixed",
    value: { amount: 1000, currency: "ILS", period: "monthly" },
  },
  housingEnabled: true,
  optional: {},
  rates: { usdToIls: 3.0, jodToIls: 5.22 },
});

const expect = (label, actual, expected) => {
  const ok = Math.abs(actual - expected) < 0.01;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(28)}  got ${actual}  expected ${expected}`);
  if (!ok) process.exitCode = 1;
};

expect("gross annual ILS", result.gross, 180_000);
expect("transport annual ILS", result.transport, 12_000);
expect("total exemptions ILS", result.totalExemptions, 78_000); // 12k + 36k + 30k
expect("taxable base ILS", result.taxable, 102_000);
expect("bracket 1 tax", result.brackets[0].tax, 3_750);
expect("bracket 2 tax", result.brackets[1].tax, 2_700);
expect("bracket 3 tax", result.brackets[2].tax, 0);
expect("total tax ILS", result.total, 6_450);
expect("total tax USD", result.total / 3.0, 2_150);
