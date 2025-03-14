import React from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface NumericInputProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: string;
  errorMessage?: string;
  testId?: string;
}

const NumericInput = ({
  id,
  name,
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step = "any",
  errorMessage = "Please provide a valid number",
  testId,
}: NumericInputProps) => {
  return (
    <>
      <Form.Label htmlFor={id}>{label}</Form.Label>
      <InputGroup className="mb-3">
        <Form.Control
          id={id}
          name={name}
          type="number"
          step={step}
          value={value}
          onChange={onChange}
          required
          min={min}
          max={max}
        />
        {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
        <Form.Control.Feedback type="invalid" data-testid={testId}>
          {errorMessage}
        </Form.Control.Feedback>
      </InputGroup>
    </>
  );
};

export default NumericInput;
