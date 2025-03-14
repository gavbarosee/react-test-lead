/**
 * Represents the mortgage form input data
 */
export interface MortgageFormData {
  propertyPrice: number;
  deposit: number;
  mortgageTerm: number;
  interestRate: number;
}

/**
 * Represents the calculated mortgage results
 */
export interface MortgageResults {
  monthlyPayment: number;
  totalRepayment: number;
  capital: number;
  interest: number;
  affordabilityCheck: number;
}
