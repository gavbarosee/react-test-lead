import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface CurrencyInputProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  errorMessage?: string;
  testId?: string;
}

const CurrencyInput = ({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  errorMessage = "Please provide a valid amount",
  testId,
}: CurrencyInputProps) => {
  return (
    <>
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <InputGroup className="mb-3">
        <InputGroup.Text>£</InputGroup.Text>
        <Form.Control
          id={id}
          name={name}
          type="number"
          className="no-spinner"
          step="any"
          value={value}
          onChange={onChange}
          required
          min={min}
          max={max}
        />
        <Form.Control.Feedback type="invalid" data-testid={testId}>
          {errorMessage}
        </Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default CurrencyInput;
