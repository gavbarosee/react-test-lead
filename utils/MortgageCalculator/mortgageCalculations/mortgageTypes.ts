/**
 * Represents a single record in the yearly mortgage breakdown.
 *
 * @property {number} year - The year in the mortgage term (0 = start of mortgage).
 * @property {number} remainingDebt - The remaining loan balance at the end of this year.
 */
export interface YearlyBreakdownRecord {
  year: number;
  remainingDebt: number;
}
