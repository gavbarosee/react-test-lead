import { renderHook, act } from "@testing-library/react";
import { useMortgageCalculator } from ".";

// mock functions for all imported calculation utilities
const mockCalculateMonthlyPayment = jest.fn().mockReturnValue(763.68);
const mockCalculateCapital = jest.fn().mockReturnValue(95000);
const mockCalculateTotalRepayment = jest.fn().mockReturnValue(137462.4);
const mockCalculateTotalInterest = jest.fn().mockReturnValue(42462.4);
const mockCalculateAffordabilityCheck = jest.fn().mockReturnValue(921.63);
const mockCalculateYearlyBreakdown = jest.fn().mockReturnValue([
  { year: 0, remainingDebt: 95000 },
  { year: 1, remainingDebt: 90000 },
]);

jest.mock("../../utils/MortgageCalculator/mortgageCalculations", () => ({
  calculateMonthlyPayment: (...args: any[]) =>
    mockCalculateMonthlyPayment(...args),
  calculateCapital: (...args: any[]) => mockCalculateCapital(...args),
  calculateTotalRepayment: (...args: any[]) =>
    mockCalculateTotalRepayment(...args),
  calculateTotalInterest: (...args: any[]) =>
    mockCalculateTotalInterest(...args),
  calculateAffordabilityCheck: (...args: any[]) =>
    mockCalculateAffordabilityCheck(...args),
  calculateYearlyBreakdown: (...args: any[]) =>
    mockCalculateYearlyBreakdown(...args),
}));

// fetch API mock
global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        rate: 4.5,
        lastUpdated: "2025-03-14",
        isError: false,
      }),
  })
) as jest.Mock;

describe("useMortgageCalculator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with default values", () => {
    const { result } = renderHook(() => useMortgageCalculator());

    // initial form data
    expect(result.current.formData).toEqual({
      propertyPrice: 100000,
      deposit: 5000,
      mortgageTerm: 15,
      interestRate: 5.25,
    });

    //  initial state values
    expect(result.current.validated).toBe(false);
    expect(result.current.results).toBeNull();
    expect(result.current.yearlyBreakdown).toEqual([]);
    expect(result.current.useBoERate).toBe(false);
  });

  test("handles input changes correctly", () => {
    const { result } = renderHook(() => useMortgageCalculator());

    //simulate changing the property price input
    act(() => {
      result.current.handleInputChange({
        target: {
          name: "propertyPrice",
          value: "200000",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // verify the form data was updated
    expect(result.current.formData.propertyPrice).toBe(200000);
  });

  test("fetches Bank of England rate on mount", async () => {
    renderHook(() => useMortgageCalculator());

    // check that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith("/api/interest-rate");
  });

  test("toggles Bank of England rate correctly", async () => {
    const { result, rerender } = renderHook(() => useMortgageCalculator());

    // wait for the useEffect to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // toggle the BoE rate
    act(() => {
      result.current.handleBoERateToggle({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // check that the toggle state changed
    expect(result.current.useBoERate).toBe(true);

    // re-render to allow the effect to run
    rerender();

    // interest rate should now be the BoE rate (4.5)
    expect(result.current.formData.interestRate).toBe(4.5);
  });

  test("calculates results when form is submitted", () => {
    const { result } = renderHook(() => useMortgageCalculator());

    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {
        checkValidity: jest.fn().mockReturnValue(true),
      },
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    // vrify that the calculation functions were called
    expect(mockCalculateMonthlyPayment).toHaveBeenCalledWith(
      100000,
      5000,
      5.25,
      15
    );
    expect(mockCalculateCapital).toHaveBeenCalledWith(100000, 5000);
    expect(mockCalculateTotalRepayment).toHaveBeenCalledWith(763.68, 15);
    expect(mockCalculateTotalInterest).toHaveBeenCalledWith(137462.4, 95000);
    expect(mockCalculateAffordabilityCheck).toHaveBeenCalledWith(
      100000,
      5000,
      5.25,
      15
    );
    expect(mockCalculateYearlyBreakdown).toHaveBeenCalledWith(
      100000,
      5000,
      5.25,
      15
    );

    // verify that the results were set correctly
    expect(result.current.results).toEqual({
      monthlyPayment: 763.68,
      totalRepayment: 137462.4,
      capital: 95000,
      interest: 42462.4,
      affordabilityCheck: 921.63,
    });

    // vrify that the yearly breakdown was set
    expect(result.current.yearlyBreakdown).toEqual([
      { year: 0, remainingDebt: 95000 },
      { year: 1, remainingDebt: 90000 },
    ]);
  });

  test("validates the form and prevents submission when invalid", () => {
    const { result } = renderHook(() => useMortgageCalculator());

    // set invalid form data (deposit >= property price)
    act(() => {
      result.current.handleInputChange({
        target: { name: "deposit", value: "110000" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {
        checkValidity: jest.fn().mockReturnValue(true),
      },
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    expect(mockCalculateMonthlyPayment).not.toHaveBeenCalled();
    expect(result.current.validated).toBe(true);
    expect(result.current.results).toBeNull();
  });

  test("handles form submission with invalid checkValidity", () => {
    const { result } = renderHook(() => useMortgageCalculator());

    const mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      currentTarget: {
        checkValidity: jest.fn().mockReturnValue(false),
      },
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.handleSubmit(mockEvent);
    });

    // the form should not be processed
    expect(mockCalculateMonthlyPayment).not.toHaveBeenCalled();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(result.current.validated).toBe(true);
    expect(result.current.results).toBeNull();
  });
});
