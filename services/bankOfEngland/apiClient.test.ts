import {
  BOE_BASE_URL,
  BOE_ENDPOINT,
  buildBankOfEnglandUrl,
  fetchFromBankOfEngland,
} from "./apiClient";

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  text: jest.fn().mockResolvedValue("CSV data"),
});

jest.mock("./apiClient", () => {
  const originalModule = jest.requireActual("./apiClient");

  return {
    ...originalModule,
    buildBankOfEnglandUrl: (dateRange: { from: string; to: string }) => {
      const baseUrl = BOE_BASE_URL;
      const formattedBaseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";

      return `${formattedBaseUrl}fromshowcolumns.asp?csv.x=yes&Datefrom=${dateRange.from}&Dateto=${dateRange.to}&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`;
    },
  };
});

describe("Bank of England API Client", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("buildBankOfEnglandUrl constructs proper URL with given date range", () => {
    const dateRange = {
      from: "01/Jan/2024",
      to: "31/Jan/2024",
    };

    const url = buildBankOfEnglandUrl(dateRange);

    expect(url).toContain(`${BOE_BASE_URL}/${BOE_ENDPOINT}`);
    expect(url).toContain("Datefrom=01/Jan/2024");
    expect(url).toContain("Dateto=31/Jan/2024");
    expect(url).toContain("SeriesCodes=IUMABEDR");
    expect(url).toContain("CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N");
  });

  test("fetchFromBankOfEngland calls fetch with the correct URL", async () => {
    const dateRange = {
      from: "01/Jan/2024",
      to: "31/Jan/2024",
    };

    await fetchFromBankOfEngland(dateRange);

    // check that fetch was called with the URL built by buildBankOfEnglandUrl
    expect(fetch).toHaveBeenCalledWith(buildBankOfEnglandUrl(dateRange));
  });

  test("fetchFromBankOfEngland returns the response text on success", async () => {
    const dateRange = {
      from: "01/Jan/2024",
      to: "31/Jan/2024",
    };

    const result = await fetchFromBankOfEngland(dateRange);

    expect(result).toBe("CSV data");
  });

  test("fetchFromBankOfEngland throws error when fetch fails", async () => {
    // mock fetch to return error response for just this test
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const dateRange = {
      from: "01/Jan/2024",
      to: "31/Jan/2024",
    };

    await expect(fetchFromBankOfEngland(dateRange)).rejects.toThrow(
      "Failed to fetch data: 500 Internal Server Error"
    );
  });
});
