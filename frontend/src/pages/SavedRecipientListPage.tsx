import { useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import useAxios from "axios-hooks";
import { SAVED_RECIPIENTS, byId } from "../api/endpoints";
import instance from "../api/axios";
import type { SavedRecipient } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { formatBankAccount } from "../utils/bankAccount";

const SavedRecipientListPage = () => {
  const navigate = useNavigate();
  const [{ data, loading, error }, refetch] = useAxios<SavedRecipient[]>(
    SAVED_RECIPIENTS,
    { useCache: false },
  );

  const [deleteTarget, setDeleteTarget] = useState<SavedRecipient | null>(null);
  const [deletebusy, setDeleteBusy] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await instance.delete(byId(SAVED_RECIPIENTS, deleteTarget.id));
      setDeleteTarget(null);
      refetch();
    } finally {
      setDeleteBusy(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Alert variant="danger">
        Greška pri učitavanju primaoca. Pokušajte ponovo.
      </Alert>
    );

  const recipients = data ?? [];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Primaoci plaćanja</h4>
        <Button variant="primary" onClick={() => navigate("/receiver/new")}>
          Dodaj
        </Button>
      </div>

      {recipients.length === 0 ? (
        <EmptyState
          message="Nemate sačuvanih primaoca plaćanja."
          onAdd={() => navigate("/receiver/new")}
        />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ime primaoca</th>
              <th>Adresa</th>
              <th>Broj računa</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {recipients.map((r) => (
              <tr key={r.id}>
                <td>{r.recipient_full_name}</td>
                <td>{r.recipient_address}</td>
                <td>{formatBankAccount(r.bank_account)}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => navigate(`/receiver/${r.id}`)}
                  >
                    Izmeni
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => setDeleteTarget(r)}
                  >
                    Obriši
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <ConfirmDeleteModal
        show={!!deleteTarget}
        itemLabel={deleteTarget?.recipient_full_name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deletebusy}
      />
    </>
  );
};

export default SavedRecipientListPage;
