import React from "react";
import Table from "react-bootstrap/Table";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { MortgageResults } from "@/types/mortgage";

interface MortgageResultsProps {
  results: MortgageResults | null;
}

const MortgageResultsTable = ({ results }: MortgageResultsProps) => {
  return (
    <>
      <h2 className="pb-3">Results</h2>
      <Table striped="columns">
        <tbody>
          <tr className="border-b border-t">
            <td>Monthly Payment</td>
            <td className="text-right">
              {results
                ? formatCurrency(results.monthlyPayment)
                : formatCurrency(0)}
            </td>
          </tr>
          <tr className="border-b">
            <td>Total Repayment</td>
            <td className="text-right">
              {results
                ? formatCurrency(results.totalRepayment)
                : formatCurrency(0)}
            </td>
          </tr>
          <tr className="border-b">
            <td>Capital</td>
            <td className="text-right">
              {results ? formatCurrency(results.capital) : formatCurrency(0)}
            </td>
          </tr>
          <tr className="border-b">
            <td>Interest</td>
            <td className="text-right">
              {results ? formatCurrency(results.interest) : formatCurrency(0)}
            </td>
          </tr>
          <tr className="border-b">
            <td>Affordability check</td>
            <td className="text-right">
              {results
                ? formatCurrency(results.affordabilityCheck)
                : formatCurrency(0)}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default MortgageResultsTable;
