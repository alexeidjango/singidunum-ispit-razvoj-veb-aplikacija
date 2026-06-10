import { Button, Modal, Spinner } from "react-bootstrap";

interface ConfirmDeleteModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  itemLabel?: string;
}

export const ConfirmDeleteModal = ({
  show,
  onConfirm,
  onCancel,
  busy = false,
  itemLabel,
}: ConfirmDeleteModalProps) => (
  <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton>
      <Modal.Title>Potvrda brisanja</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {itemLabel
        ? `Da li ste sigurni da želite da obrišete "${itemLabel}"?`
        : "Da li ste sigurni da želite da obrišete ovaj zapis?"}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel} disabled={busy}>
        Otkaži
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={busy}>
        {busy ? <Spinner animation="border" size="sm" /> : "Obriši"}
      </Button>
    </Modal.Footer>
  </Modal>
);
