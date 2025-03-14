import { fetchLatestInterestRate } from "./interestRateService";
import { getLastMonthDateRange } from "./dateUtils";
import { parseInterestRateFromCSV } from "./csvParser";
import { fetchFromBankOfEngland } from "./apiClient";

jest.mock("./dateUtils", () => ({
  getLastMonthDateRange: jest.fn(),
}));

jest.mock("./csvParser", () => ({
  parseInterestRateFromCSV: jest.fn(),
}));

jest.mock("./apiClient", () => ({
  fetchFromBankOfEngland: jest.fn(),
}));

describe("Interest Rate Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // default mock implementation
    (getLastMonthDateRange as jest.Mock).mockReturnValue({
      from: "15/Feb/2024",
      to: "15/Mar/2024",
    });

    (fetchFromBankOfEngland as jest.Mock).mockResolvedValue("mock,csv,data");
    (parseInterestRateFromCSV as jest.Mock).mockReturnValue(4.75);
  });

  test("successful fetch returns correct interest rate data", async () => {
    const result = await fetchLatestInterestRate();

    // check the happy path
    expect(getLastMonthDateRange).toHaveBeenCalled();
    expect(fetchFromBankOfEngland).toHaveBeenCalledWith({
      from: "15/Feb/2024",
      to: "15/Mar/2024",
    });
    expect(parseInterestRateFromCSV).toHaveBeenCalledWith("mock,csv,data");

    expect(result).toEqual({
      rate: 4.75,
      lastUpdated: expect.any(String),
      isError: false,
    });
  });

  test("handles CSV parsing failure gracefully", async () => {
    // mock parse function to return null (parsing failure)
    (parseInterestRateFromCSV as jest.Mock).mockReturnValue(null);

    const result = await fetchLatestInterestRate();

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toBe(
      "Could not parse interest rate from the data"
    );
    expect(result.rate).toBe(0);
  });

  test("handles fetch error gracefully", async () => {
    // mock fetch to throw an error
    (fetchFromBankOfEngland as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const result = await fetchLatestInterestRate();

    expect(result.isError).toBe(true);
    expect(result.errorMessage).toBe("Network error");
    expect(result.rate).toBe(0);
  });
});
