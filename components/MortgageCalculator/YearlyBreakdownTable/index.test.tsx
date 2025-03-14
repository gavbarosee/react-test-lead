import React from "react";
import { render, screen } from "@testing-library/react";
import YearlyBreakdownTable from ".";
import { YearlyBreakdownRecord } from "@/utils/MortgageCalculator/mortgageCalculations";
import { formatCurrency } from "@/utils/formatting/formatCurrency";

describe("YearlyBreakdownTable", () => {
  test("renders the table header correctly", () => {
    render(<YearlyBreakdownTable breakdown={[]} />);

    expect(screen.getByText("Yearly Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Remaining Debt")).toBeInTheDocument();
  });

  test("renders a default row with zero when breakdown is empty", () => {
    render(<YearlyBreakdownTable breakdown={[]} />);

    // should display year 0 with formatted zero amount
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(0))).toBeInTheDocument();
  });

  test("renders all years in the breakdown", () => {
    const mockBreakdown: YearlyBreakdownRecord[] = [
      { year: 0, remainingDebt: 95000 },
      { year: 1, remainingDebt: 90000 },
      { year: 2, remainingDebt: 85000 },
    ];

    render(<YearlyBreakdownTable breakdown={mockBreakdown} />);

    // check that all years are displayed
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    // check that the debt amounts are formatted correctly
    expect(screen.getByText(formatCurrency(95000))).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(90000))).toBeInTheDocument();
    expect(screen.getByText(formatCurrency(85000))).toBeInTheDocument();
  });
});
