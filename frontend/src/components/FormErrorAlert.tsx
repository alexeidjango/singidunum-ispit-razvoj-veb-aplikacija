import { Alert } from "react-bootstrap";

interface FormErrorAlertProps {
  message?: string | null;
}

export const FormErrorAlert = ({ message }: FormErrorAlertProps) => {
  if (!message) return null;
  return <Alert variant="danger">{message}</Alert>;
};
