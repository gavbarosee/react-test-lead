// Calculations / formulae are based on the readme file

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
