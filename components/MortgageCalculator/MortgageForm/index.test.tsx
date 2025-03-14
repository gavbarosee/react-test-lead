import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MortgageForm from ".";
import { MortgageFormData } from "@/types/mortgage";

// mocking the sub-components to simplify testing
jest.mock("../FormFields/CurrencyInput", () => ({
  __esModule: true,
  default: ({ id, label, value, onChange }: any) => (
    <div data-testid={`mock-currency-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} data-testid={id} value={value} onChange={onChange} />
    </div>
  ),
}));

jest.mock("../FormFields/NumericInput", () => ({
  __esModule: true,
  default: ({ id, label, value, onChange }: any) => (
    <div data-testid={`mock-numeric-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input id={id} data-testid={id} value={value} onChange={onChange} />
    </div>
  ),
}));

jest.mock("../FormFields/PercentageInput", () => ({
  __esModule: true,
  default: ({ id, label, value, onChange, disabled }: any) => (
    <div data-testid={`mock-percentage-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  ),
}));

jest.mock("../BankOfEnglandToggle", () => ({
  __esModule: true,
  default: ({ useBoERate, handleBoERateToggle }: any) => (
    <div data-testid="mock-boe-toggle">
      <input
        type="checkbox"
        data-testid="boe-toggle"
        checked={useBoERate}
        onChange={handleBoERateToggle}
      />
      <span>Use Bank of England rate</span>
    </div>
  ),
}));

describe("MortgageForm", () => {
  const defaultFormData: MortgageFormData = {
    propertyPrice: 250000,
    deposit: 50000,
    mortgageTerm: 25,
    interestRate: 4.5,
  };

  const mockProps = {
    formData: defaultFormData,
    validated: false,
    boeRate: { rate: 4.25, lastUpdated: "2025-03-14", isError: false },
    isLoadingRate: false,
    useBoERate: false,
    handleInputChange: jest.fn(),
    handleBoERateToggle: jest.fn(),
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all form components", () => {
    render(<MortgageForm {...mockProps} />);

    // check that all input fields are rendered
    expect(
      screen.getByTestId("mock-currency-propertyPrice")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-currency-deposit")).toBeInTheDocument();
    expect(screen.getByTestId("mock-numeric-mortgageTerm")).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-percentage-interestRate")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-boe-toggle")).toBeInTheDocument();

    // check for the submit button
    expect(
      screen.getByRole("button", { name: /Calculate/i })
    ).toBeInTheDocument();
  });

  test("calls handleSubmit when form is submitted", () => {
    render(<MortgageForm {...mockProps} />);

    const form = screen
      .getByRole("button", { name: /Calculate/i })
      .closest("form")!;
    fireEvent.submit(form);

    expect(mockProps.handleSubmit).toHaveBeenCalled();
  });

  test("validates the form", () => {
    render(<MortgageForm {...mockProps} validated={true} />);

    const form = screen
      .getByRole("button", { name: /Calculate/i })
      .closest("form")!;
    // form should have the validated class when validated is true
    expect(form).toHaveAttribute("noValidate");
    expect(form).toHaveClass("was-validated");
  });

  test("calls handleInputChange when input changes", () => {
    render(<MortgageForm {...mockProps} />);

    const propertyPriceInput = screen.getByTestId("propertyPrice");
    fireEvent.change(propertyPriceInput, { target: { value: "300000" } });

    expect(mockProps.handleInputChange).toHaveBeenCalled();
  });

  test("calls handleBoERateToggle when BoE toggle is clicked", () => {
    render(<MortgageForm {...mockProps} />);

    const boeToggle = screen.getByTestId("boe-toggle");
    fireEvent.click(boeToggle);

    expect(mockProps.handleBoERateToggle).toHaveBeenCalled();
  });

  test("disables interest rate input when useBoERate is true", () => {
    render(<MortgageForm {...mockProps} useBoERate={true} />);

    const interestRateInput = screen.getByTestId("interestRate");
    expect(interestRateInput).toHaveAttribute("disabled");
  });
});
