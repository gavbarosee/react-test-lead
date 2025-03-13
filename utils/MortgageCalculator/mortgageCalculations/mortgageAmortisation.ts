import { calculateCapital } from "./mortgageCore";
import { YearlyBreakdownRecord } from "./mortgageTypes";

/**
 * Calculates the initial loan amount based on property price and deposit.
 *
 * @param {number} propertyPrice - The total price of the property.
 * @param {number} deposit - The amount paid as a deposit.
 * @returns {number} The initial loan amount (property price minus deposit).
 */
export function calculateLoanAmount(
  propertyPrice: number,
  deposit: number
): number {
  return calculateCapital(propertyPrice, deposit);
}

/**
 * Converts an annual interest rate to a monthly interest rate.
 *
 * @param {number} annualRate - The annual interest rate as a percentage (e.g., 5.25 for 5.25%).
 * @returns {number} The equivalent monthly interest rate as a decimal (e.g., 0.004375).
 * @example
 * // returns 0.004375 (which is 0.4375%).
 * convertToMonthlyInterestRate(5.25);
 */
export function convertToMonthlyInterestRate(annualRate: number): number {
  return annualRate / 100 / 12;
}

/**
 * Applies a full year of monthly payments (12 payments) and returns the final balance.
 *
 * This function repeatedly applies monthly payments to simulate the passing of a year.
 * in the mortgage term.
 *
 * @param {number} startingBalance - The balance at the start of the year.
 * @param {number} monthlyPayment - The fixed monthly payment amount.
 * @param {number} monthlyRate - The monthly interest rate as a decimal.
 * @returns {number} The remaining balance after 12 monthly payments.
 */
export function applyOneYearOfPayments(
  startingBalance: number,
  monthlyPayment: number,
  monthlyRate: number
): number {
  let balance = startingBalance;

  // apply 12 monthly payments
  for (let month = 1; month <= 12; month++) {
    balance = applyMonthlyPayment(balance, monthlyPayment, monthlyRate);
  }

  return balance;
}

/**
 * Generates a record for a specific year in the mortgage amortization schedule.
 *
 * For year 0, this returns the initial state.
 * For all other years, it calculates the balance after applying that year's payments.
 *
 * @param {number} year - The year in the mortgage term.
 * @param {number} previousYearBalance - The balance at the end of the previous year.
 * @param {number} monthlyPayment - The monthly payment amount.
 * @param {number} monthlyRate - The monthly interest rate as a decimal.
 * @returns {YearlyBreakdownRecord} A record containing the year and its ending balance.
 */
export function generateRecordForYear(
  year: number,
  previousYearBalance: number,
  monthlyPayment: number,
  monthlyRate: number
): YearlyBreakdownRecord {
  // skip payment calculation for year 0 (initial state)
  if (year === 0) {
    return { year, remainingDebt: previousYearBalance };
  }

  const remainingDebt = applyOneYearOfPayments(
    previousYearBalance,
    monthlyPayment,
    monthlyRate
  );

  return { year, remainingDebt };
}

/**
 * Calculates the portion of a monthly payment that goes toward interest.
 *
 * @param {number} balance - The current loan balance.
 * @param {number} monthlyRate - The monthly interest rate as a decimal.
 * @returns {number} The interest amount for this payment.
 * @example
 * // if balance is £100,000 and monthly rate is 0.004375 (5.25% / 12).
 * // returns £437.50
 * calculateInterestPortion(100000, 0.004375);
 */
export function calculateInterestPortion(
  balance: number,
  monthlyRate: number
): number {
  return balance * monthlyRate;
}

/**
 * Calculates the portion of a monthly payment that reduces the principal.
 *
 * @param {number} monthlyPayment - The total monthly payment amount.
 * @param {number} interestPortion - The portion that goes toward interest.
 * @returns {number} The principal reduction amount.
 * @example
 * // if monthly payment is £800 and interest portion is £437.50.
 * // returns £362.50
 * calculatePrincipalPortion(800, 437.50);
 */
export function calculatePrincipalPortion(
  monthlyPayment: number,
  interestPortion: number
): number {
  return monthlyPayment - interestPortion;
}

/**
 * Applies a single monthly payment to the current balance and returns the new balance.
 *
 * For each payment, the interest is calculated first, then the remainder of the
 * payment reduces the principal.
 *
 * @param {number} currentBalance - The loan balance before this payment.
 * @param {number} monthlyPayment - The monthly payment amount.
 * @param {number} monthlyRate - The monthly interest rate as a decimal.
 * @returns {number} The new balance after this payment.
 */
export function applyMonthlyPayment(
  currentBalance: number,
  monthlyPayment: number,
  monthlyRate: number
): number {
  const interestPortion = calculateInterestPortion(currentBalance, monthlyRate);
  const principalPortion = calculatePrincipalPortion(
    monthlyPayment,
    interestPortion
  );

  // Calculate new balance and ensure it's not negative
  let newBalance = currentBalance - principalPortion;
  return newBalance < 0 ? 0 : newBalance;
}

/**
 * Creates the initial record representing the mortgage at year 0 (start).
 *
 * @param {number} loanAmount - The initial loan amount.
 * @returns {YearlyBreakdownRecord} A record representing the starting point of the mortgage.
 */
export function createInitialRecord(loanAmount: number): YearlyBreakdownRecord {
  return { year: 0, remainingDebt: loanAmount };
}
