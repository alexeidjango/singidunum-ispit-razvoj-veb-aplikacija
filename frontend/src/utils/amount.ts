/** Converts a number to a 2-decimal string for the API (e.g. 25000 → "25000.00") */
export const toAmountString = (value: number): string => value.toFixed(2);

/** Parses an API decimal string to a number for form editing (e.g. "25000.00" → 25000) */
export const parseAmount = (value: string): number => parseFloat(value) || 0;
