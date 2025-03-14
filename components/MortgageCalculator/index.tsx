import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import MortgageForm from "./MortgageForm";
import MortgageResultsTable from "./MortgageResults";
import YearlyBreakdownTable from "./YearlyBreakdownTable";
import useMortgageCalculator from "@/hooks/useMortgageCalculator";

const MortgageCalculator: React.FC = () => {
  const {
    formData,
    validated,
    results,
    yearlyBreakdown,
    boeRate,
    isLoadingRate,
    useBoERate,
    handleInputChange,
    handleBoERateToggle,
    handleSubmit,
  } = useMortgageCalculator();

  return (
    <Container>
      <title>Mortgage Calculator</title>
      <Row className="gap-x-10 pt-3">
        <Col className="border-r" md="auto">
          <MortgageForm
            formData={formData}
            validated={validated}
            boeRate={boeRate}
            isLoadingRate={isLoadingRate}
            useBoERate={useBoERate}
            handleInputChange={handleInputChange}
            handleBoERateToggle={handleBoERateToggle}
            handleSubmit={handleSubmit}
          />
        </Col>

        <Col md="auto">
          <MortgageResultsTable results={results} />
        </Col>

        <Col md="auto">
          <YearlyBreakdownTable breakdown={yearlyBreakdown} />
        </Col>
      </Row>
    </Container>
  );
};

export default MortgageCalculator;
