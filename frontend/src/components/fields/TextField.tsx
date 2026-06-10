import { Form } from "react-bootstrap";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
  type?: string;
  readOnly?: boolean;
  placeholder?: string;
}

export const TextField = ({
  label,
  registration,
  error,
  type = "text",
  readOnly = false,
  placeholder,
}: TextFieldProps) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      {...registration}
      type={type}
      isInvalid={!!error}
      readOnly={readOnly}
      plaintext={readOnly}
      placeholder={placeholder}
    />
    <Form.Control.Feedback type="invalid">
      {error?.message}
    </Form.Control.Feedback>
  </Form.Group>
);
