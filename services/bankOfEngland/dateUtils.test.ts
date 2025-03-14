import { formatDateForBankOfEngland } from "./dateUtils";

describe("Bank of England Date Utilities", () => {
  describe("formatDateForBankOfEngland", () => {
    test("formats date correctly", () => {
      const testDate = new Date(2024, 0, 15); // Jan 15, 2024
      const formatted = formatDateForBankOfEngland(testDate);

      expect(formatted).toBe("15/Jan/2024");
    });

    test("handles single-digit days with padding", () => {
      const testDate = new Date(2024, 0, 5); // Jan 5, 2024
      const formatted = formatDateForBankOfEngland(testDate);

      expect(formatted).toBe("05/Jan/2024");
    });

    test("formats different months correctly", () => {
      const marchDate = new Date(2024, 2, 15); // Mar 15, 2024
      expect(formatDateForBankOfEngland(marchDate)).toBe("15/Mar/2024");

      const octoberDate = new Date(2024, 9, 15); // Oct 15, 2024
      expect(formatDateForBankOfEngland(octoberDate)).toBe("15/Oct/2024");
    });
  });
});
