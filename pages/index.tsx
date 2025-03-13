import { useState, FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";

import { formatCurrency } from "@/utils/formatting/formatCurrency";

import {
  calculateAffordabilityCheck,
  calculateCapital,
  calculateTotalInterest,
  calculateTotalRepayment,
  calculateYearlyBreakdown,
  calculateMonthlyPayment,
  YearlyBreakdownRecord,
} from "@/utils/MortgageCalculator/mortgageCalculations";

interface MortgageFormData {
  propertyPrice: number;
  deposit: number;
  mortgageTerm: number;
  interestRate: number;
}

interface MortgageResults {
  monthlyPayment: number;
  totalRepayment: number;
  capital: number;
  interest: number;
  affordabilityCheck: number;
}

export default function MortgageCalculator() {
  const [formData, setFormData] = useState<MortgageFormData>({
    propertyPrice: 100000,
    deposit: 5000,
    mortgageTerm: 15,
    interestRate: 5.25,
  });

  const [results, setResults] = useState<MortgageResults | null>(null);

  const [yearlyBreakdown, setYearlyBreakdown] = useState<
    YearlyBreakdownRecord[]
  >([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0, // convert to number, default to 0 if NaN
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("formdata:", formData);

    const { propertyPrice, deposit, mortgageTerm, interestRate } = formData;

    const monthlyPayment = calculateMonthlyPayment(
      propertyPrice,
      deposit,
      interestRate,
      mortgageTerm
    );

    const capital = calculateCapital(propertyPrice, deposit);
    const totalRepayment = calculateTotalRepayment(
      monthlyPayment,
      mortgageTerm
    );
    const interest = calculateTotalInterest(totalRepayment, capital);
    const affordabilityCheck = calculateAffordabilityCheck(
      propertyPrice,
      deposit,
      interestRate,
      mortgageTerm
    );

    const breakdown = calculateYearlyBreakdown(
      propertyPrice,
      deposit,
      interestRate,
      mortgageTerm
    );

    setResults({
      monthlyPayment,
      totalRepayment,
      capital,
      interest,
      affordabilityCheck,
    });

    setYearlyBreakdown(breakdown);
  };

  return (
    <Container>
      <title>Mortgage Calculator Test</title>
      <Row className="gap-x-10 pt-3">
        <Col className="border-r" md="auto">
          <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="propertyPrice">Property Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="propertyPrice"
                name="propertyPrice"
                type="number"
                className="no-spinner"
                step="any"
                value={formData.propertyPrice}
                onChange={handleInputChange}
              />
            </InputGroup>
            <Form.Label htmlFor="deposit">Deposit</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="deposit"
                name="deposit"
                type="number"
                className="no-spinner"
                step="any"
                value={formData.deposit}
                onChange={handleInputChange}
              />
            </InputGroup>

            <Form.Label htmlFor="mortgageTerm">Mortgage Term</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="mortgageTerm"
                name="mortgageTerm"
                type="number"
                step="any"
                value={formData.mortgageTerm}
                onChange={handleInputChange}
              />
              <InputGroup.Text>years</InputGroup.Text>
            </InputGroup>
            <Form.Label htmlFor="interestRate">Interest rate</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="interestRate"
                name="interestRate"
                type="number"
                step="any"
                className="no-spinner"
                value={formData.interestRate}
                onChange={handleInputChange}
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
            <Button className="w-full" variant="primary" type="submit">
              Calculate
            </Button>
          </Form>
        </Col>

        <Col md="auto">
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
                  {results
                    ? formatCurrency(results.capital)
                    : formatCurrency(0)}
                </td>
              </tr>
              <tr className="border-b">
                <td>Interest</td>
                <td className="text-right">
                  {results
                    ? formatCurrency(results.interest)
                    : formatCurrency(0)}
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
        </Col>

        <Col md="auto">
          <h2 className="pb-3">Yearly Breakdown</h2>
          <Table className="max-w-52" bordered hover size="sm">
            <thead>
              <tr>
                <th>Year</th>
                <th>Remaining Debt</th>
              </tr>
            </thead>
            <tbody>
              {yearlyBreakdown.length > 0 ? (
                yearlyBreakdown.map((item) => (
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
        </Col>
      </Row>
    </Container>
  );
}
