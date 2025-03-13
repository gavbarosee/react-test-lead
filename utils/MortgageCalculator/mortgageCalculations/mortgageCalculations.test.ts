import { EXTRA_INTEREST_RATE } from "../constants";

import {
  calculateCapital,
  calculateTotalInterest,
  calculateTotalRepayment,
  calculateMonthlyPayment,
  calculateYearlyBreakdown,
  calculateAffordabilityCheck,
} from ".";

describe("Mortgage utility functions", () => {
  const propertyPrice = 100000;
  const deposit = 5000;
  const annualInterestRate = 5.25;
  const mortgageTermInYears = 15;

  describe("calculateMonthlyPayment", () => {
    test("should calculate the correct monthly payment with interest", () => {
      const result = calculateMonthlyPayment(300000, 60000, 3.5, 30);
      expect(result).toBeCloseTo(1077.71, 2);
    });

    test("should calculate the correct monthly payment without interest", () => {
      const result = calculateMonthlyPayment(300000, 60000, 0, 30);
      expect(result).toBeCloseTo(666.67, 2);
    });

    test("should calculate the correct monthly payment with a different term", () => {
      const result = calculateMonthlyPayment(300000, 60000, 3.5, 15);
      expect(result).toBeCloseTo(1715.72, 2);
    });
  });

  describe("calculateCapital", () => {
    test("should calculate the correct capital (loan amount)", () => {
      const result = calculateCapital(propertyPrice, deposit);
      expect(result).toBe(95000);
    });

    test("should handle zero deposit", () => {
      const result = calculateCapital(propertyPrice, 0);
      expect(result).toBe(propertyPrice);
    });

    test("should handle deposit equal to property price", () => {
      const result = calculateCapital(propertyPrice, propertyPrice);
      expect(result).toBe(0);
    });
  });

  describe("calculateTotalRepayment", () => {
    test("should calculate the correct total repayment", () => {
      const monthlyPayment = 763.68;
      const result = calculateTotalRepayment(
        monthlyPayment,
        mortgageTermInYears
      );
      expect(result).toBeCloseTo(137462.4, 1);
    });

    test("should handle very short term (1 year)", () => {
      const monthlyPayment = 8000;
      const result = calculateTotalRepayment(monthlyPayment, 1);
      expect(result).toBe(96000); // 8000 * 12
    });

    test("should handle long term (30 years)", () => {
      const monthlyPayment = 500;
      const result = calculateTotalRepayment(monthlyPayment, 30);
      expect(result).toBe(180000); // 500 * 12 * 30
    });
  });

  describe("calculateTotalInterest", () => {
    test("should calculate the correct total interest", () => {
      const totalRepayment = 137463.09;
      const capital = 95000;
      const result = calculateTotalInterest(totalRepayment, capital);
      expect(result).toBeCloseTo(42463.09, 2);
    });

    test("should handle zero interest case", () => {
      const capital = 95000;
      const result = calculateTotalInterest(capital, capital);
      expect(result).toBe(0);
    });
  });

  describe("calculateAffordabilityCheck", () => {
    test("should calculate the correct monthly payment with a 3% increased interest rate", () => {
      const increasedInterestRate = annualInterestRate + EXTRA_INTEREST_RATE; // 8.25%

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

    test("should handle 0% interest rate case", () => {
      const result = calculateAffordabilityCheck(
        propertyPrice,
        deposit,
        0,
        mortgageTermInYears
      );

      // with 0% original + 3% affordability check
      const expectedResult = calculateMonthlyPayment(
        propertyPrice,
        deposit,
        EXTRA_INTEREST_RATE,
        mortgageTermInYears
      );

      expect(result).toBeCloseTo(expectedResult, 2);
    });
  });

  describe("calculateYearlyBreakdown", () => {
    test("should return the correct number of records", () => {
      const breakdown = calculateYearlyBreakdown(
        propertyPrice,
        deposit,
        annualInterestRate,
        mortgageTermInYears
      );

      // should have records for starting year (0) plus each year of the term
      expect(breakdown.length).toBe(mortgageTermInYears + 1);
    });

    test("should have the correct initial record (year 0)", () => {
      const breakdown = calculateYearlyBreakdown(
        propertyPrice,
        deposit,
        annualInterestRate,
        mortgageTermInYears
      );

      const initialRecord = breakdown[0];
      expect(initialRecord.year).toBe(0);
      expect(initialRecord.remainingDebt).toBe(
        calculateCapital(propertyPrice, deposit)
      );
    });

    test("should have the final record with balance near zero", () => {
      const breakdown = calculateYearlyBreakdown(
        propertyPrice,
        deposit,
        annualInterestRate,
        mortgageTermInYears
      );

      const finalRecord = breakdown[mortgageTermInYears];
      expect(finalRecord.year).toBe(mortgageTermInYears);
      expect(finalRecord.remainingDebt).toBeCloseTo(0, 0); // should be very close to zero
    });

    test("should have decreasing balance for each year", () => {
      const breakdown = calculateYearlyBreakdown(
        propertyPrice,
        deposit,
        annualInterestRate,
        mortgageTermInYears
      );

      for (let i = 1; i < breakdown.length; i++) {
        expect(breakdown[i].remainingDebt).toBeLessThan(
          breakdown[i - 1].remainingDebt
        );
      }
    });

    test("should handle 0% interest rate", () => {
      const zeroInterestBreakdown = calculateYearlyBreakdown(
        propertyPrice,
        deposit,
        0,
        mortgageTermInYears
      );

      const loanAmount = calculateCapital(propertyPrice, deposit);
      const monthlyPayment = loanAmount / (mortgageTermInYears * 12);

      // check that each year decreases by the same amount
      for (let i = 1; i <= mortgageTermInYears; i++) {
        const expectedDebt = loanAmount - i * 12 * monthlyPayment;
        expect(zeroInterestBreakdown[i].remainingDebt).toBeCloseTo(
          Math.max(0, expectedDebt),
          1
        );
      }
    });

    test("should handle short term (1 year)", () => {
      const shortTermBreakdown = calculateYearlyBreakdown(
        propertyPrice,
        deposit,
        annualInterestRate,
        1
      );

      expect(shortTermBreakdown.length).toBe(2); // Year 0 + Year 1
      expect(shortTermBreakdown[0].year).toBe(0);
      expect(shortTermBreakdown[1].year).toBe(1);
      expect(shortTermBreakdown[1].remainingDebt).toBeCloseTo(0, 0);
    });

    test("should handle large property price and long term", () => {
      const breakdown = calculateYearlyBreakdown(
        1000000, // 1 million
        200000, // 20% deposit
        3.5, // 3.5% interest
        30 // 30-year term
      );

      expect(breakdown.length).toBe(31); // 0-30 years
      expect(breakdown[0].remainingDebt).toBe(800000);
      expect(breakdown[30].remainingDebt).toBeCloseTo(0, 0);
    });
  });
});
