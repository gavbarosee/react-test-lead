export type { YearlyBreakdownRecord } from "./mortgageTypes";

export {
  calculateCapital,
  calculateTotalRepayment,
  calculateTotalInterest,
  calculateAffordabilityCheck,
  calculateYearlyBreakdown,
} from "./mortgageCore";

export {
  calculateLoanAmount,
  convertToMonthlyInterestRate,
  applyOneYearOfPayments,
  generateRecordForYear,
  calculateInterestPortion,
  calculatePrincipalPortion,
  applyMonthlyPayment,
  createInitialRecord,
} from "./mortgageAmortisation";

export { calculateMonthlyPayment } from "./mortgagePayment";
