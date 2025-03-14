import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NumericInput from ".";

describe("NumericInput", () => {
  const defaultProps = {
    id: "mortgage-term",
    name: "mortgageTerm",
    label: "Mortgage Term",
    value: 25,
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with the correct label and value", () => {
    render(<NumericInput {...defaultProps} />);

    expect(screen.getByLabelText("Mortgage Term")).toBeInTheDocument();
    expect(screen.getByLabelText("Mortgage Term")).toHaveValue(25);
  });

  test("renders with suffix when provided", () => {
    render(<NumericInput {...defaultProps} suffix="years" />);

    expect(screen.getByText("years")).toBeInTheDocument();
  });

  test("calls onChange when the value changes", () => {
    render(<NumericInput {...defaultProps} />);

    const input = screen.getByLabelText("Mortgage Term");
    fireEvent.change(input, { target: { value: "30" } });

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test("applies min/max restrictions", () => {
    render(<NumericInput {...defaultProps} min={1} max={40} />);

    const input = screen.getByLabelText("Mortgage Term");
    expect(input).toHaveAttribute("min", "1");
    expect(input).toHaveAttribute("max", "40");
  });

  test("applies the step attribute correctly", () => {
    render(<NumericInput {...defaultProps} step="5" />);

    const input = screen.getByLabelText("Mortgage Term");
    expect(input).toHaveAttribute("step", "5");
  });

  test("displays custom error message", () => {
    const errorMessage = "Term must be between 1 and 40 years";
    render(
      <NumericInput
        {...defaultProps}
        errorMessage={errorMessage}
        testId="error-message"
      />
    );

    const feedback = screen.getByTestId("error-message");
    expect(feedback).toHaveTextContent(errorMessage);
  });
});
