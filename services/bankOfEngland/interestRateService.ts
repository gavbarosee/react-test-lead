/**
 * Service to fetch and parse interest rate data from the Bank of England.
 */
import { InterestRateData } from "./types";
import { getLastMonthDateRange } from "./dateUtils";
import { parseInterestRateFromCSV } from "./csvParser";
import { fetchFromBankOfEngland } from "./apiClient";

export async function fetchLatestInterestRate(): Promise<InterestRateData> {
  try {
    const dateRange = getLastMonthDateRange();
    const csvData = await fetchFromBankOfEngland(dateRange);
    const rate = parseInterestRateFromCSV(csvData);

    if (rate === null) {
      return {
        rate: 0,
        lastUpdated: new Date().toISOString(),
        isError: true,
        errorMessage: "Could not parse interest rate from the data",
      };
    }

    return {
      rate,
      lastUpdated: new Date().toISOString(),
      isError: false,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return {
      rate: 0,
      lastUpdated: new Date().toISOString(),
      isError: true,
      errorMessage,
    };
  }
}
