import { parseInterestRateFromCSV } from "./csvParser";

describe("Bank of England CSV Parser", () => {
  test("returns null for empty input", () => {
    expect(parseInterestRateFromCSV("")).toBeNull();
    expect(parseInterestRateFromCSV("  ")).toBeNull();
    expect(parseInterestRateFromCSV(null as unknown as string)).toBeNull();
  });

  test("parses valid CSV and returns most recent interest rate", () => {
    // using the exact format returned by Bank of England API
    const csvData = `01/Jan/2024,4.25
15/Jan/2024,4.50
31/Jan/2024,4.75`;

    const result = parseInterestRateFromCSV(csvData);

    expect(result).toBe(4.75);
  });

  test("handles CSV with header row and returns most recent interest rate", () => {
    const csvData = `DATE,IUMABEDR
01/Jan/2024,4.25
15/Jan/2024,4.50
31/Jan/2024,4.75`;

    const result = parseInterestRateFromCSV(csvData);

    expect(result).toBe(4.75);
  });

  test("returns null for CSV without valid data rows", () => {
    const csvData = `IUMABEDR,Value
IUMABEDR,Title`;

    const result = parseInterestRateFromCSV(csvData);

    expect(result).toBeNull();
  });

  test("skips invalid data rows and returns most recent valid rate", () => {
    const csvData = `01/Jan/2024,4.25
15/Jan/2024,invalid
31/Jan/2024,4.75`;

    const result = parseInterestRateFromCSV(csvData);

    expect(result).toBe(4.75);
  });

  test("correctly identifies the most recent date", () => {
    // note: im intentionally having the dates out of order here to test sorting by date
    const csvData = `15/Jan/2024,4.50
01/Jan/2024,4.25
31/Jan/2024,4.75`;

    const result = parseInterestRateFromCSV(csvData);

    // should return the rate from the most recent date (31/Jan/2024)
    expect(result).toBe(4.75);
  });
});
