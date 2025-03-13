/**
 * Formats a date as DD/MMM/YYYY for use with the Bank of England API.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDateForBankOfEngland(date: Date): string {
  // format: DD/MMM/YYYY (e.g., 18/Jan/2024)
  const day = date.getDate().toString().padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Generates date parameters for the Bank of England API for the last month.
 *
 * @returns An object with from and to date strings.
 */
export function getLastMonthDateRange(): { from: string; to: string } {
  const today = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(today.getMonth() - 1);

  return {
    from: formatDateForBankOfEngland(lastMonth),
    to: formatDateForBankOfEngland(today),
  };
}
