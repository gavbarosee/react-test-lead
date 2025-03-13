/**
 * Extracts the most recent interest rate from Bank of England CSV data.
 *
 * the Bank of England CSV contains:
 * - a header row
 * - multiple data rows with DATE in the first column and interest rate (IUMABEDR) in the second
 *
 * this function finds the row with the most recent date and returns its interest rate.
 *
 * @param csvData - Raw CSV string from the Bank of England API
 * @returns The most recent interest rate as a number, or null if no valid rate found
 */
export function parseInterestRateFromCSV(csvData: string): number | null {
  // return early if we have no data to process
  if (!csvData || csvData.trim() === "") {
    return null;
  }

  // split into lines and remove empty lines
  const csvLines = csvData
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "");

  // skip the header line(s)
  const dataLines = csvLines.filter((line) => !line.startsWith("IUMABEDR"));

  if (dataLines.length === 0) {
    return null; //no data lines found
  }

  // parse each line into [date, rate]
  const parsedData = dataLines
    .map((line) => {
      const [dateStr, rateStr] = line.split(",").map((item) => item.trim());
      return {
        date: new Date(dateStr), //convert date string to Date object
        rate: parseFloat(rateStr), // convert rate string to number
      };
    })
    .filter((item) => !isNaN(item.rate) && !isNaN(item.date.getTime())); // keep only valid entries

  if (parsedData.length === 0) {
    return null; // no valid data found
  }

  // find the entry with the most recent date
  const mostRecentEntry = parsedData.reduce(
    (latest, current) => (current.date > latest.date ? current : latest),
    parsedData[0]
  );

  return mostRecentEntry.rate;
}
