import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface PercentageInputProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: string;
  disabled?: boolean;
  errorMessage?: string;
  testId?: string;
}

const PercentageInput = ({
  id,
  name,
  label,
  value,
  onChange,
  min,
  max,
  step = "0.01",
  disabled = false,
  errorMessage = "Please provide a valid percentage",
  testId,
}: PercentageInputProps) => {
  return (
    <>
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          id={id}
          name={name}
          type="number"
          step={step}
          className="no-spinner"
          value={value}
          onChange={onChange}
          required
          min={min}
          max={max}
          disabled={disabled}
        />
        <InputGroup.Text>%</InputGroup.Text>
        <Form.Control.Feedback type="invalid" data-testid={testId}>
          {errorMessage}
        </Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default PercentageInput;
