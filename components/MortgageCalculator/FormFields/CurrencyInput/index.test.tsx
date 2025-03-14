import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyInput from ".";

describe("CurrencyInput", () => {
  const defaultProps = {
    id: "property-price",
    name: "propertyPrice",
    label: "Property Price",
    value: 250000,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with the correct label and value", () => {
    render(<CurrencyInput {...defaultProps} />);

    expect(screen.getByLabelText("Property Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Property Price")).toHaveValue(250000);
    expect(screen.getByText("£")).toBeInTheDocument();
  });

  test("calls onChange when the value changes", () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Property Price");
    fireEvent.change(input, { target: { value: "300000" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test("applies min/max restrictions", () => {
    render(<CurrencyInput {...defaultProps} min={100000} max={1000000} />);

    const input = screen.getByLabelText("Property Price");
    expect(input).toHaveAttribute("min", "100000");
    expect(input).toHaveAttribute("max", "1000000");
  });

  test("adds required attribute to the input", () => {
    render(<CurrencyInput {...defaultProps} />);

    const input = screen.getByLabelText("Property Price");
    expect(input).toHaveAttribute("required");
  });

  test("shows custom error message", () => {
    const errorMessage = "Property price must be greater than zero";
    render(
      <CurrencyInput
        {...defaultProps}
        errorMessage={errorMessage}
        testId="error-message"
      />
    );

    const feedback = screen.getByTestId("error-message");
    expect(feedback).toHaveTextContent(errorMessage);
  });
});
