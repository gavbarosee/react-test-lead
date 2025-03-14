import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { CurrencyInput, NumericInput, PercentageInput } from "./FormFields";
import BankOfEnglandToggle from "./BankOfEnglandToggle";
import { InterestRateData } from "@/services/bankOfEngland";
import { MortgageFormData } from "@/types/mortgage";

interface MortgageFormProps {
  formData: MortgageFormData;
  validated: boolean;
  boeRate: InterestRateData | null;
  isLoadingRate: boolean;
  useBoERate: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBoERateToggle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const MortgageForm = ({
  formData,
  validated,
  boeRate,
  isLoadingRate,
  useBoERate,
  handleInputChange,
  handleBoERateToggle,
  handleSubmit,
}: MortgageFormProps) => {
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <CurrencyInput
        id="propertyPrice"
        name="propertyPrice"
        label="Property Price"
        value={formData.propertyPrice}
        onChange={handleInputChange}
        min={1}
        errorMessage="Please provide a valid property price"
        testId="invalid-property-price"
      />

      <CurrencyInput
        id="deposit"
        name="deposit"
        label="Deposit"
        value={formData.deposit}
        onChange={handleInputChange}
        min={1}
        max={formData.propertyPrice}
        errorMessage="Deposit cannot be negative or must be less than property price"
        testId="invalid-deposit"
      />

      <NumericInput
        id="mortgageTerm"
        name="mortgageTerm"
        label="Mortgage Term"
        value={formData.mortgageTerm}
        onChange={handleInputChange}
        suffix="years"
        min={1}
        errorMessage="Mortgage term must be greater than 0"
        testId="invalid-mortgage-term"
      />

      <PercentageInput
        id="interestRate"
        name="interestRate"
        label="Interest rate"
        value={formData.interestRate}
        onChange={handleInputChange}
        min={0}
        disabled={useBoERate}
        errorMessage="Interest rate cannot be negative"
        testId="invalid-interest-rate"
      />

      <BankOfEnglandToggle
        boeRate={boeRate}
        isLoadingRate={isLoadingRate}
        useBoERate={useBoERate}
        handleBoERateToggle={handleBoERateToggle}
      />

      <Button className="w-full" variant="primary" type="submit">
        Calculate
      </Button>
    </Form>
  );
};

export default MortgageForm;
