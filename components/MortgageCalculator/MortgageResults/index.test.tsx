import React from "react";
import { render, screen } from "@testing-library/react";
import MortgageResultsTable from ".";
import { MortgageResults } from "@/types/mortgage";
import { formatCurrency } from "@/utils/formatting/formatCurrency";

describe("MortgageResultsTable", () => {
  test("renders the table header correctly", () => {
    render(<MortgageResultsTable results={null} />);

    expect(screen.getByText("Results")).toBeInTheDocument();
  });

  test("renders zero values when results are null", () => {
    render(<MortgageResultsTable results={null} />);

    // check that all labels exist
    expect(screen.getByText("Monthly Payment")).toBeInTheDocument();
    expect(screen.getByText("Total Repayment")).toBeInTheDocument();
    expect(screen.getByText("Capital")).toBeInTheDocument();
    expect(screen.getByText("Interest")).toBeInTheDocument();
    expect(screen.getByText("Affordability check")).toBeInTheDocument();

    // check that formatted zero values are displayed for each field
    const formattedZero = formatCurrency(0);
    const cells = screen.getAllByText(formattedZero);
    expect(cells.length).toBe(5); // should have 5 cells with zero value
  });

  test("renders the correct values when results are provided", () => {
    const mockResults: MortgageResults = {
      monthlyPayment: 763.68,
      totalRepayment: 137462.4,
      capital: 95000,
      interest: 42462.4,
      affordabilityCheck: 921.63,
    };

    render(<MortgageResultsTable results={mockResults} />);

    // check that formatted values are displayed for each field
    expect(
      screen.getByText(formatCurrency(mockResults.monthlyPayment))
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatCurrency(mockResults.totalRepayment))
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatCurrency(mockResults.capital))
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatCurrency(mockResults.interest))
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatCurrency(mockResults.affordabilityCheck))
    ).toBeInTheDocument();
  });
});
