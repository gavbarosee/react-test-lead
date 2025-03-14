import React from "react";
import Table from "react-bootstrap/Table";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { YearlyBreakdownRecord } from "@/utils/MortgageCalculator/mortgageCalculations";

interface YearlyBreakdownTableProps {
  breakdown: YearlyBreakdownRecord[];
}

const YearlyBreakdownTable = ({ breakdown }: YearlyBreakdownTableProps) => {
  return (
    <>
      <h2 className="pb-3">Yearly Breakdown</h2>
      <Table className="max-w-52" bordered hover size="sm">
        <thead>
          <tr>
            <th>Year</th>
            <th>Remaining Debt</th>
          </tr>
        </thead>
        <tbody>
          {breakdown.length > 0 ? (
            breakdown.map((item) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{formatCurrency(item.remainingDebt)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>0</td>
              <td>{formatCurrency(0)}</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default YearlyBreakdownTable;
