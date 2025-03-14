import React from "react";
import { render, screen } from "@testing-library/react";
import MortgageCalculator from "./index";
import useMortgageCalculator from "@/hooks/useMortgageCalculator";

// mock the hooks and sub-components
jest.mock("../../hooks/useMortgageCalculator", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("./MortgageForm", () => ({
  __esModule: true,
  default: () => <div data-testid="mock-mortgage-form">Mortgage Form</div>,
}));

jest.mock("./MortgageResults", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-mortgage-results">Mortgage Results</div>
  ),
}));

jest.mock("./YearlyBreakdownTable", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-yearly-breakdown">Yearly Breakdown</div>
  ),
}));

describe("MortgageCalculator", () => {
  // mock values for the useMortgageCalculator hook
  const mockHookReturnValue = {
    formData: {
      propertyPrice: 250000,
      deposit: 50000,
      mortgageTerm: 25,
      interestRate: 4.5,
    },
    validated: false,
    results: null,
    yearlyBreakdown: [],
    boeRate: { rate: 4.25, lastUpdated: "2025-03-14", isError: false },
    isLoadingRate: false,
    useBoERate: false,
    handleInputChange: jest.fn(),
    handleBoERateToggle: jest.fn(),
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useMortgageCalculator as jest.Mock).mockReturnValue(mockHookReturnValue);
  });

  test("renders all three main components", () => {
    render(<MortgageCalculator />);

    expect(screen.getByTestId("mock-mortgage-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-mortgage-results")).toBeInTheDocument();
    expect(screen.getByTestId("mock-yearly-breakdown")).toBeInTheDocument();
  });

  test("calls useMortgageCalculator hook", () => {
    render(<MortgageCalculator />);

    expect(useMortgageCalculator).toHaveBeenCalled();
  });

  test("renders with title", () => {
    render(<MortgageCalculator />);

    // check for the title element
    expect(document.title).toBe("Mortgage Calculator");
  });

  test("renders with correct layout", () => {
    const { container } = render(<MortgageCalculator />);

    // check that components are in the correct containers
    const row = container.querySelector(".row");
    expect(row).toBeInTheDocument();

    const columns = container.querySelectorAll(".col-md-auto");
    expect(columns.length).toBe(3);
  });
});
