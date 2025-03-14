import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PercentageInput from ".";

describe("PercentageInput", () => {
  const defaultProps = {
    id: "interest-rate",
    name: "interestRate",
    label: "Interest Rate",
    value: 5.25,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with the correct label and value", () => {
    render(<PercentageInput {...defaultProps} />);

    expect(screen.getByLabelText("Interest Rate")).toBeInTheDocument();
    expect(screen.getByLabelText("Interest Rate")).toHaveValue(5.25);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  test("calls onChange when the value changes", () => {
    render(<PercentageInput {...defaultProps} />);

    const input = screen.getByLabelText("Interest Rate");
    fireEvent.change(input, { target: { value: "6.5" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test("applies min/max restrictions", () => {
    render(<PercentageInput {...defaultProps} min={0} max={10} />);

    const input = screen.getByLabelText("Interest Rate");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "10");
  });

  test("applies step attribute", () => {
    render(<PercentageInput {...defaultProps} step="0.1" />);

    const input = screen.getByLabelText("Interest Rate");
    expect(input).toHaveAttribute("step", "0.1");
  });

  test("can be disabled", () => {
    render(<PercentageInput {...defaultProps} disabled={true} />);

    const input = screen.getByLabelText("Interest Rate");
    expect(input).toBeDisabled();
  });

  test("displays custom error message", () => {
    const errorMessage = "Rate must be positive";

    render(
      <PercentageInput
        {...defaultProps}
        errorMessage={errorMessage}
        testId="error-message"
      />
    );

    const feedback = screen.getByTestId("error-message");
    expect(feedback).toHaveTextContent(errorMessage);
  });
});
