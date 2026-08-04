import { formatINR as formatINRHelper, formatFullINR, parseINRAmount, calculateDetailedConstructionCost } from './currency';

export type AreaUnit = 'sqft' | 'cent' | 'ground' | 'acre';

export interface AreaUnitConfig {
  id: AreaUnit;
  nameEn: string;
  nameTa: string;
  symbolEn: string;
  symbolTa: string;
  sqFtMultiplier: number; // Factor to convert to Sq Ft
}

export const TAMILNADU_AREA_UNITS: AreaUnitConfig[] = [
  { id: 'sqft', nameEn: 'Square Feet', nameTa: 'சதுர அடி', symbolEn: 'sq ft', symbolTa: 'ச.அடி', sqFtMultiplier: 1 },
  { id: 'cent', nameEn: 'Cent', nameTa: 'சென்ட்', symbolEn: 'Cent', symbolTa: 'சென்ட்', sqFtMultiplier: 435.6 },
  { id: 'ground', nameEn: 'Ground', nameTa: 'கிரவுண்ட்', symbolEn: 'Ground', symbolTa: 'கிரவுண்ட்', sqFtMultiplier: 2400 },
  { id: 'acre', nameEn: 'Acre', nameTa: 'ஏக்கர்', symbolEn: 'Acre', symbolTa: 'ஏக்கர்', sqFtMultiplier: 43560 },
];

export function convertToSqFt(value: number, unit: AreaUnit): number {
  const config = TAMILNADU_AREA_UNITS.find((u) => u.id === unit);
  if (!config) return value;
  return value * config.sqFtMultiplier;
}

export function convertFromSqFt(sqFtValue: number, targetUnit: AreaUnit): number {
  const config = TAMILNADU_AREA_UNITS.find((u) => u.id === targetUnit);
  if (!config || config.sqFtMultiplier === 0) return sqFtValue;
  const converted = sqFtValue / config.sqFtMultiplier;
  return Number(converted.toFixed(2));
}

export function convertArea(value: number, fromUnit: AreaUnit, toUnit: AreaUnit): number {
  const sqFt = convertToSqFt(value, fromUnit);
  return convertFromSqFt(sqFt, toUnit);
}

export function formatAreaSummary(sqFtValue: number, isTamil: boolean = false): string {
  const cents = convertFromSqFt(sqFtValue, 'cent');
  const grounds = convertFromSqFt(sqFtValue, 'ground');
  
  if (isTamil) {
    if (sqFtValue >= 2400) {
      return `${sqFtValue.toLocaleString()} ச.அடி (${grounds} கிரவுண்ட் / ${cents} சென்ட்)`;
    }
    return `${sqFtValue.toLocaleString()} ச.அடி (${cents} சென்ட்)`;
  } else {
    if (sqFtValue >= 2400) {
      return `${sqFtValue.toLocaleString()} sq ft (${grounds} Grounds / ${cents} Cents)`;
    }
    return `${sqFtValue.toLocaleString()} sq ft (${cents} Cents)`;
  }
}

// Re-export INR Currency formatting with Lakhs (லட்சம்) and Crores (கோடி) support
export const formatINR = formatINRHelper;
export { formatFullINR, parseINRAmount, calculateDetailedConstructionCost };

