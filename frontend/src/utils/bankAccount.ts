/**
 * Formats a normalized 18-digit bank account into the Serbian
 * short display format: XXX-YYYYYYYYY-ZZ
 */
export const formatBankAccount = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 18) return raw;
  const bank = digits.slice(0, 3);
  const account = digits.slice(3, 16).replace(/^0+/, "") || "0";
  const control = digits.slice(16, 18);
  return `${bank}-${account}-${control}`;
};
