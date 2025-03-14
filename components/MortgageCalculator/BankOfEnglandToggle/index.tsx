import React from "react";
import { Alert, Spinner, Form } from "react-bootstrap";
import { InterestRateData } from "@/services/bankOfEngland";

interface BankOfEnglandToggleProps {
  boeRate: InterestRateData | null;
  isLoadingRate: boolean;
  useBoERate: boolean;
  handleBoERateToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BankOfEnglandToggle = ({
  boeRate,
  isLoadingRate,
  useBoERate,
  handleBoERateToggle,
}: BankOfEnglandToggleProps) => {
  if (isLoadingRate) {
    return (
      <div className="mb-3 d-flex align-items-center">
        <Spinner animation="border" size="sm" />
        <span className="ms-2">Loading Bank of England rate...</span>
      </div>
    );
  }

  if (boeRate && !boeRate.isError) {
    return (
      <Form.Check
        type="switch"
        id="useBoERate"
        label={`Use Bank of England rate (${boeRate.rate}%)`}
        checked={useBoERate}
        onChange={handleBoERateToggle}
        className="mb-3"
      />
    );
  }

  if (boeRate && boeRate.isError) {
    return (
      <Alert variant="warning" className="mb-3">
        Failed to load Bank of England rate: {boeRate.errorMessage}
      </Alert>
    );
  }

  return null;
};

export default BankOfEnglandToggle;
