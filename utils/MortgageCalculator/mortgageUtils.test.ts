import { EXTRA_INTEREST_RATE } from "../constants";
import { calculateMonthlyPayment } from "./calculateRepayment";
import {
  calculateCapital,
  calculateTotalRepayment,
  calculateTotalInterest,
  calculateAffordabilityCheck,
} from "./mortgageUtils";

describe("Mortgage utility functions", () => {
  const propertyPrice = 100000;
  const deposit = 5000;
  const term = 15;

  describe("calculateCapital", () => {
    test("should calculate the correct capital (loan amount)", () => {
      const result = calculateCapital(propertyPrice, deposit);
      expect(result).toBe(95000);
    });
  });

  describe("calculateTotalRepayment", () => {
    test("should calculate the correct total repayment", () => {
      const monthlyPayment = 763.68;
      const result = calculateTotalRepayment(monthlyPayment, term);
      expect(result).toBeCloseTo(137462.4, 1);
    });
  });

  describe("calculateTotalInterest", () => {
    test("should calculate the correct total interest", () => {
      const totalRepayment = 137463.09;
      const capital = 95000;
      const result = calculateTotalInterest(totalRepayment, capital);
      expect(result).toBeCloseTo(42463.09, 2);
    });
  });

  describe("calculateAffordabilityCheck", () => {
    test("should calculate the correct monthly payment with a 3% increased interest rate", () => {
      const propertyPrice = 100000;
      const deposit = 5000;
      const annualInterestRate = 5; // 5% original interest rate
      const mortgageTermInYears = 15;
      const increasedInterestRate = annualInterestRate + EXTRA_INTEREST_RATE; // 8%

      const expectedResult = calculateMonthlyPayment(
        propertyPrice,
        deposit,
        increasedInterestRate,
        mortgageTermInYears
      );

      const result = calculateAffordabilityCheck(
        propertyPrice,
        deposit,
        annualInterestRate,
        mortgageTermInYears
      );

      expect(result).toBeCloseTo(expectedResult, 2);
    });
  });
});
