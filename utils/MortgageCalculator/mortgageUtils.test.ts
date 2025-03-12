import {
  calculateCapital,
  calculateTotalRepayment,
  calculateTotalInterest,
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
});
