const BOE_BASE_URL =
  process.env.BOE_API_URL || "https://www.bankofengland.co.uk/boeapps/iadb";
const BOE_ENDPOINT = "fromshowcolumns.asp";

/**
 * Constructs the Bank of England API URL with appropriate parameters
 *
 * @param dateRange - Object containing from and to date strings.
 * @returns Properly formatted Bank of England API URL.
 */
export function buildBankOfEnglandUrl(dateRange: {
  from: string;
  to: string;
}): string {
  const baseUrl = BOE_BASE_URL.endsWith("/")
    ? BOE_BASE_URL
    : BOE_BASE_URL + "/";

  // construct the query string in the expected order
  return `${baseUrl}${BOE_ENDPOINT}?csv.x=yes&Datefrom=${dateRange.from}&Dateto=${dateRange.to}&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`;
}

/**
 * Makes a request to the Bank of England API
 */
export async function fetchFromBankOfEngland(dateRange: {
  from: string;
  to: string;
}): Promise<string> {
  const url = buildBankOfEnglandUrl(dateRange);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}
