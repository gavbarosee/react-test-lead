import { EXTRA_INTEREST_RATE } from "@/utils/MortgageCalculator/constants";
import { calculateMonthlyPayment } from "./mortgagePayment";
import { YearlyBreakdownRecord } from "./mortgageTypes";
import {
  calculateLoanAmount,
  convertToMonthlyInterestRate,
  createInitialRecord,
  generateRecordForYear,
} from "./mortgageAmortisation";

/**
 * C = P - D
 * where:
 * - C is the capital (loan amount)
 * - P is the property price
 * - D is the deposit
 *
 * Calculates the capital (loan amount) by subtracting deposit from property price.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @returns The capital (loan amount).
 */
export function calculateCapital(
  propertyPrice: number,
  deposit: number
): number {
  return propertyPrice - deposit;
}

/**
 *
 * T = M * n
 * where:
 * - T is the total repayment amount
 * - M is the monthly mortgage payment
 * - n is the total number of payments (mortgage term in years \* 12)
 *
 * Calculates the total repayment over the entire mortgage term.
 *
 * @param monthlyPayment - The monthly payment amount.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The total repayment amount.
 */
export function calculateTotalRepayment(
  monthlyPayment: number,
  mortgageTermInYears: number
): number {
  const totalNumberOfPayments = mortgageTermInYears * 12;
  return monthlyPayment * totalNumberOfPayments;
}

/**
 *
 * I = T - C
 * where:
 * - I is the total interest paid
 * - T is the total repayment amount
 * - C is the capital (loan amount)
 *
 * Calculates the total interest paid over the entire mortgage term.
 *
 * @param totalRepayment - The total repayment amount.
 * @param capital - The capital (loan amount).
 * @returns The total interest paid.
 */
export function calculateTotalInterest(
  totalRepayment: number,
  capital: number
): number {
  return totalRepayment - capital;
}

/**
 * Calculates the affordability check by determining the monthly payment
 * with a 3% increase in the interest rate.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The monthly payment with the increased interest rate.
 */
export function calculateAffordabilityCheck(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  // calculate with 3% higher interest rate
  return calculateMonthlyPayment(
    propertyPrice,
    deposit,
    annualInterestRate + EXTRA_INTEREST_RATE,
    mortgageTermInYears
  );
}

/**
 * Creates a year-by-year breakdown of the remaining mortgage balance.
 *
 * This function generates an amortization schedule showing how a mortgage
 * balance decreases over time. It returns an array where each element
 * represents the state of the mortgage at the end of a year.
 *
 * @param {number} propertyPrice - The total price of the property.
 * @param {number} deposit - The initial down payment amount.
 * @param {number} annualInterestRate - The annual interest rate as a percentage (e.g., 5.25).
 * @param {number} mortgageTermInYears - The length of the mortgage in years.
 * @returns {YearlyBreakdownRecord[]} An array with the remaining balance at the end of each year.
 *
 * @example
 * // for a £200,000 property with a £40,000 deposit, 3% interest rate and 25-year term
 * const breakdown = calculateYearlyBreakdown(200000, 40000, 3, 25);
 * // returns array of YearlyBreakdownRecord objects showing yearly balance reduction
 * // first element (year 0) will have remainingDebt of £160,000
 * // last element (year 25) will have remainingDebt of £0
 */
export function calculateYearlyBreakdown(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): YearlyBreakdownRecord[] {
  // calculate the basic mortgage parameters
  const loanAmount = calculateLoanAmount(propertyPrice, deposit);
  const monthlyPayment = calculateMonthlyPayment(
    propertyPrice,
    deposit,
    annualInterestRate,
    mortgageTermInYears
  );
  const monthlyRate = convertToMonthlyInterestRate(annualInterestRate);

  // initialize the result with the starting balance
  const breakdown: YearlyBreakdownRecord[] = [createInitialRecord(loanAmount)];

  // calculate each year's balance and add to the breakdown
  for (let year = 1; year <= mortgageTermInYears; year++) {
    const previousYearBalance = breakdown[year - 1].remainingDebt;

    const yearRecord = generateRecordForYear(
      year,
      previousYearBalance,
      monthlyPayment,
      monthlyRate
    );

    breakdown.push(yearRecord);
  }

  return breakdown;
}
