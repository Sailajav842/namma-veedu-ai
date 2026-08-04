// Namma Veedu AI - Currency & Cost Calculation Utility (INR - ₹)

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

// Modular currency configuration (Locked to INR for Tamil Nadu)
export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: 'INR',
  symbol: '₹',
  name: 'Indian Rupee',
  locale: 'en-IN',
};

/**
 * Format standard Indian Rupee values using Indian numbering system
 * Examples:
 * - 75000 -> ₹75,000
 * - 350000 -> ₹3,50,000
 * - 2550000 -> ₹25,50,000
 * - 12000000 -> ₹1,20,00,000
 */
export function formatFullINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${DEFAULT_CURRENCY.symbol}0`;
  }
  const formatted = new Intl.NumberFormat(DEFAULT_CURRENCY.locale, {
    maximumFractionDigits: 0,
  }).format(amount);

  return `${DEFAULT_CURRENCY.symbol}${formatted}`;
}

/**
 * Compact INR formatting supporting Lakhs (லட்சம்) and Crores (கோடி)
 * Examples:
 * - 2550000 -> ₹25.50 Lakhs (or ₹25.50 லட்சம் in Tamil)
 * - 12000000 -> ₹1.20 Cr (or ₹1.20 கோடி in Tamil)
 */
export function formatINR(amount: number, isTamil: boolean = false, compactThreshold: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${DEFAULT_CURRENCY.symbol}0`;
  }

  if (compactThreshold) {
    if (amount >= 10000000) { // 1 Crore (10 Million)
      const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
      return isTamil ? `${DEFAULT_CURRENCY.symbol}${cr} கோடி` : `${DEFAULT_CURRENCY.symbol}${cr} Cr`;
    } else if (amount >= 100000) { // 1 Lakh (100 Thousand)
      const lk = (amount / 100000).toFixed(2).replace(/\.00$/, '');
      return isTamil ? `${DEFAULT_CURRENCY.symbol}${lk} லட்சம்` : `${DEFAULT_CURRENCY.symbol}${lk} Lakhs`;
    }
  }

  return formatFullINR(amount);
}

/**
 * Parses user typed budget or cost input into numeric amount.
 * Handles string formats like "20 Lakhs", "1.5 Cr", "350000", "₹ 25 Lakhs"
 */
export function parseINRAmount(input: string | number): number {
  if (typeof input === 'number') return input;
  if (!input) return 0;

  const clean = input.toString().replace(/₹|,|\s/g, '').toLowerCase();

  if (clean.includes('crore') || clean.includes('cr')) {
    const val = parseFloat(clean.replace(/(crore|cr)/g, ''));
    return isNaN(val) ? 0 : Math.round(val * 10000000);
  }

  if (clean.includes('lakh') || clean.includes('lk')) {
    const val = parseFloat(clean.replace(/(lakhs|lakh|lk)/g, ''));
    return isNaN(val) ? 0 : Math.round(val * 100000);
  }

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

/**
 * Complete Construction Itemized Cost Breakdown Calculator
 */
export interface ItemizedCostBreakdown {
  cementCost: number;
  steelCost: number;
  sandCost: number;
  brickCost: number;
  aggregateCost: number;
  electricalCost: number;
  plumbingCost: number;
  paintCost: number;
  labourCost: number;
  interiorCost: number;
  exteriorCost: number;
  miscellaneousCost: number;
  gstAmount: number;
  totalMaterialCost: number;
  grandTotalCost: number;
}

export function calculateDetailedConstructionCost(builtUpAreaSqFt: number, floors: number = 1, qualityTier: 'standard' | 'premium' | 'luxury' = 'standard'): ItemizedCostBreakdown {
  const totalArea = builtUpAreaSqFt * floors;
  
  // Base rate per sq ft depending on quality tier in Tamil Nadu market (in ₹)
  let ratePerSqFt = 1850; // Standard (₹1,850/sq ft)
  if (qualityTier === 'premium') ratePerSqFt = 2300; // Premium (₹2,300/sq ft)
  if (qualityTier === 'luxury') ratePerSqFt = 2950;  // Luxury (₹2,950/sq ft)

  const rawTotal = totalArea * ratePerSqFt;

  // Percentage allocation based on standard civil engineering BOQ ratios
  const cementCost = Math.round(rawTotal * 0.16);     // 16% Cement
  const steelCost = Math.round(rawTotal * 0.18);      // 18% TMT Steel
  const sandCost = Math.round(rawTotal * 0.10);       // 10% M-Sand / P-Sand
  const brickCost = Math.round(rawTotal * 0.09);      // 9% Chamber Red Bricks
  const aggregateCost = Math.round(rawTotal * 0.05);  // 5% Blue metal aggregate
  const electricalCost = Math.round(rawTotal * 0.06); // 6% Wiring & Fixtures
  const plumbingCost = Math.round(rawTotal * 0.05);   // 5% Piping & Sanitary
  const paintCost = Math.round(rawTotal * 0.04);      // 4% Primer & Asian Paints
  const interiorCost = Math.round(rawTotal * 0.05);   // 5% Doors/Windows/Tiles
  const exteriorCost = Math.round(rawTotal * 0.03);   // 3% Elevation & Weathering

  const labourCost = Math.round(rawTotal * 0.15);     // 15% Mason & Helper Labour
  const miscellaneousCost = Math.round(rawTotal * 0.04); // 4% Plan approvals & temporary water/power

  const totalMaterialCost = cementCost + steelCost + sandCost + brickCost + aggregateCost + electricalCost + plumbingCost + paintCost + interiorCost + exteriorCost;
  const subtotal = totalMaterialCost + labourCost + miscellaneousCost;
  
  // 18% GST applicable for formal civil contracts
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotalCost = subtotal + gstAmount;

  return {
    cementCost,
    steelCost,
    sandCost,
    brickCost,
    aggregateCost,
    electricalCost,
    plumbingCost,
    paintCost,
    labourCost,
    interiorCost,
    exteriorCost,
    miscellaneousCost,
    gstAmount,
    totalMaterialCost,
    grandTotalCost
  };
}
