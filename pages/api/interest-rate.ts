import {
  fetchLatestInterestRate,
  InterestRateData,
} from "@/services/bankOfEngland";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * API handler for fetching the latest interest rate from the Bank of England.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InterestRateData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      rate: 0,
      lastUpdated: new Date().toISOString(),
      isError: true,
      errorMessage: "Method Not Allowed",
    });
  }

  try {
    const interestRateData = await fetchLatestInterestRate();
    return res
      .status(interestRateData.isError ? 500 : 200)
      .json(interestRateData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Interest rate API error:", errorMessage);
    return res.status(500).json({
      rate: 0,
      lastUpdated: new Date().toISOString(),
      isError: true,
      errorMessage,
    });
  }
}
