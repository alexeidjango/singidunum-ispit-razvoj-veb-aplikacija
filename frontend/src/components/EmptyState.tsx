import { Button } from "react-bootstrap";

interface EmptyStateProps {
  message: string;
  onAdd: () => void;
  addLabel?: string;
}

export const EmptyState = ({
  message,
  onAdd,
  addLabel = "Dodaj",
}: EmptyStateProps) => (
  <div className="text-center py-5 text-muted">
    <p className="mb-3">{message}</p>
    <Button variant="primary" onClick={onAdd}>
      {addLabel}
    </Button>
  </div>
);
