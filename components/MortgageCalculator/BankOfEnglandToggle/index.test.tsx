import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BankOfEnglandToggle from ".";
import { InterestRateData } from "@/services/bankOfEngland";

describe("BankOfEnglandToggle", () => {
  const mockHandleToggle = jest.fn();
  const mockBoeRate: InterestRateData = {
    rate: 4.25,
    lastUpdated: "2025-03-14T00:00:00.000Z",
    isError: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading spinner when isLoadingRate is true", () => {
    render(
      <BankOfEnglandToggle
        boeRate={null}
        isLoadingRate={true}
        useBoERate={false}
        handleBoERateToggle={mockHandleToggle}
      />
    );

    expect(
      screen.getByText(/Loading Bank of England rate/i)
    ).toBeInTheDocument();
    // should have a spinner too
    expect(document.querySelector(".spinner-border")).toBeInTheDocument();
  });

  test("shows toggle switch with rate when rate is available", () => {
    render(
      <BankOfEnglandToggle
        boeRate={mockBoeRate}
        isLoadingRate={false}
        useBoERate={false}
        handleBoERateToggle={mockHandleToggle}
      />
    );

    expect(screen.getByText(/Use Bank of England rate/i)).toBeInTheDocument();
    expect(screen.getByText(/4.25%/)).toBeInTheDocument();

    const toggleSwitch = screen.getByRole("checkbox");
    expect(toggleSwitch).not.toBeChecked();
  });

  test("toggle is checked when useBoERate is true", () => {
    render(
      <BankOfEnglandToggle
        boeRate={mockBoeRate}
        isLoadingRate={false}
        useBoERate={true}
        handleBoERateToggle={mockHandleToggle}
      />
    );

    const toggleSwitch = screen.getByRole("checkbox");
    expect(toggleSwitch).toBeChecked();
  });

  test("calls handleBoERateToggle when toggle is clicked", () => {
    render(
      <BankOfEnglandToggle
        boeRate={mockBoeRate}
        isLoadingRate={false}
        useBoERate={false}
        handleBoERateToggle={mockHandleToggle}
      />
    );

    const toggleSwitch = screen.getByRole("checkbox");
    fireEvent.click(toggleSwitch);

    expect(mockHandleToggle).toHaveBeenCalled();
  });

  test("shows error message when there is an error", () => {
    const errorRate: InterestRateData = {
      rate: 0,
      lastUpdated: "2025-03-14T00:00:00.000Z",
      isError: true,
      errorMessage: "Failed to fetch rate",
    };

    render(
      <BankOfEnglandToggle
        boeRate={errorRate}
        isLoadingRate={false}
        useBoERate={false}
        handleBoERateToggle={mockHandleToggle}
      />
    );

    expect(
      screen.getByText(/Failed to load Bank of England rate/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch rate/i)).toBeInTheDocument();
  });

  test("renders nothing when boeRate is null and not loading", () => {
    const { container } = render(
      <BankOfEnglandToggle
        boeRate={null}
        isLoadingRate={false}
        useBoERate={false}
        handleBoERateToggle={mockHandleToggle}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
