import type { NextApiRequest, NextApiResponse } from "next";
import interestRateHandler from ".";
import { fetchLatestInterestRate } from "@/services/bankOfEngland";
import { InterestRateData } from "@/services/bankOfEngland/types";

jest.mock("../../../services/bankOfEngland", () => ({
  fetchLatestInterestRate: jest.fn(),
}));

describe("/api/interest-rate", () => {
  const createMockRequestResponse = (method = "GET") => {
    const req = {
      method,
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse<InterestRateData>;

    return { req, res };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns 405 for non-GET requests", async () => {
    const { req, res } = createMockRequestResponse("POST");

    await interestRateHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        isError: true,
        errorMessage: "Method Not Allowed",
      })
    );
  });

  test("returns 200 and interest rate data on successful fetch", async () => {
    const mockInterestRateData = {
      rate: 4.25,
      lastUpdated: "2025-03-14T12:00:00.000Z",
      isError: false,
    };

    (fetchLatestInterestRate as jest.Mock).mockResolvedValue(
      mockInterestRateData
    );

    const { req, res } = createMockRequestResponse();

    await interestRateHandler(req, res);

    expect(fetchLatestInterestRate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockInterestRateData);
  });

  test("returns 500 when there is an error fetching the interest rate", async () => {
    const mockErrorData = {
      rate: 0,
      lastUpdated: "2025-03-14T12:00:00.000Z",
      isError: true,
      errorMessage: "Failed to fetch data",
    };

    (fetchLatestInterestRate as jest.Mock).mockResolvedValue(mockErrorData);

    const { req, res } = createMockRequestResponse();

    await interestRateHandler(req, res);

    expect(fetchLatestInterestRate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        isError: true,
      })
    );
  });

  test("returns 500 when an exception is thrown", async () => {
    (fetchLatestInterestRate as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const { req, res } = createMockRequestResponse();

    await interestRateHandler(req, res);

    expect(fetchLatestInterestRate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        isError: true,
        errorMessage: "Network error",
      })
    );
  });
});
