import { Form } from "react-bootstrap";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  options: SelectOption[];
  error?: FieldError;
}

export const SelectField = ({
  label,
  registration,
  options,
  error,
}: SelectFieldProps) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Select {...registration} isInvalid={!!error}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Form.Select>
    <Form.Control.Feedback type="invalid">
      {error?.message}
    </Form.Control.Feedback>
  </Form.Group>
);
