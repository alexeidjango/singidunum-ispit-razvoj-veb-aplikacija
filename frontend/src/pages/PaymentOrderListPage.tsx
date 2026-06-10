import { useState } from "react";
import { Alert, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router";
import useAxios from "axios-hooks";
import { PAYMENT_ORDERS, byId } from "../api/endpoints";
import instance from "../api/axios";
import type { PaymentOrder } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDeleteModal } from "../components/ConfirmDeleteModal";
import { formatBankAccount } from "../utils/bankAccount";

const PaymentOrderListPage = () => {
  const navigate = useNavigate();
  const [{ data, loading, error }, refetch] = useAxios<PaymentOrder[]>(
    PAYMENT_ORDERS,
    { useCache: false },
  );

  const [deleteTarget, setDeleteTarget] = useState<PaymentOrder | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    try {
      await instance.delete(byId(PAYMENT_ORDERS, deleteTarget.id));
      setDeleteTarget(null);
      refetch();
    } finally {
      setDeleteBusy(false);
    }
  };

  // useEffect(() => {
  //   refetch();
  // }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Alert variant="danger">
        Greška pri učitavanju uplatnica. Pokušajte ponovo.
      </Alert>
    );

  const orders = data ?? [];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Istorija uplatnica</h4>
        <Button variant="primary" onClick={() => navigate("/history/new")}>
          Dodaj
        </Button>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          message="Nemate sačuvanih uplatnica."
          onAdd={() => navigate("/history/new")}
        />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Primalac</th>
              <th>Broj računa</th>
              <th>Iznos</th>
              <th>Valuta</th>
              <th>Datum</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.recipient_full_name}</td>
                <td>{formatBankAccount(o.bank_account)}</td>
                <td>{o.amount}</td>
                <td>{o.currency}</td>
                <td>{new Date(o.created_at).toLocaleDateString("sr-RS")}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-2"
                    onClick={() => navigate(`/history/${o.id}`)}
                  >
                    Izmeni
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => setDeleteTarget(o)}
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
        itemLabel={
          deleteTarget
            ? `uplatnicu za ${deleteTarget.recipient_full_name}`
            : undefined
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleteBusy}
      />
    </>
  );
};

export default PaymentOrderListPage;
