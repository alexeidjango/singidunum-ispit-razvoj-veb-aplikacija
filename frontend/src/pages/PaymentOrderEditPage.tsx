import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import useAxios from "axios-hooks";
import {
  paymentOrderSchema,
  type PaymentOrderFormValues,
} from "../schemas/paymentOrder";
import { PAYMENT_ORDERS, SAVED_RECIPIENTS, byId } from "../api/endpoints";
import instance from "../api/axios";
import type { PaymentOrder, SavedRecipient } from "../types";
import { TextField } from "../components/fields/TextField";
import { SelectField } from "../components/fields/SelectField";
import { RecipientSelect } from "../components/fields/RecipientSelect";
import { FormErrorAlert } from "../components/FormErrorAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { applyApiErrors } from "../api/errors";
import { toAmountString, parseAmount } from "../utils/amount";
import { useAuth } from "../auth/useAuth";

const CURRENCY_OPTIONS = [
  { value: "RSD", label: "RSD" },
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
];

const PaymentOrderEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined && id !== "new";
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  // Load existing order when editing
  const [{ data: existing, loading: loadingExisting }] = useAxios<PaymentOrder>(
    { url: isEdit ? byId(PAYMENT_ORDERS, id!) : "" },
    { manual: !isEdit },
  );

  // Load saved recipients for the picker
  const [{ data: recipients }] = useAxios<SavedRecipient[]>(SAVED_RECIPIENTS);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PaymentOrderFormValues>({
    resolver: yupResolver(paymentOrderSchema),
    defaultValues: {
      currency: "RSD",
      sender_name: user?.full_name ?? "",
      sender_address: user?.address ?? "",
    },
  });

  // Prefill from existing order (edit mode)
  useEffect(() => {
    if (existing) {
      reset({
        recipient_full_name: existing.recipient_full_name,
        recipient_address: existing.recipient_address,
        bank_account: existing.bank_account,
        sender_name: existing.sender_name,
        sender_address: existing.sender_address,
        amount: parseAmount(existing.amount),
        currency: existing.currency,
        reference_model: existing.reference_model ?? "",
        reference_number: existing.reference_number ?? "",
        payment_purpose: existing.payment_purpose ?? "",
        payment_code: existing.payment_code ?? "",
      });
    }
  }, [existing, reset]);

  const handleRecipientPick = (r: SavedRecipient) => {
    setValue("recipient_full_name", r.recipient_full_name);
    setValue("recipient_address", r.recipient_address);
    setValue("bank_account", r.bank_account);
  };

  const onSubmit = async (values: PaymentOrderFormValues) => {
    setFormError(null);
    const payload = {
      ...values,
      amount: toAmountString(values.amount),
    };
    try {
      if (isEdit) {
        await instance.put(byId(PAYMENT_ORDERS, id!), payload);
      } else {
        await instance.post(PAYMENT_ORDERS, payload);
      }
      navigate("/history");
    } catch (err) {
      const msg = applyApiErrors(err, setError);
      setFormError(msg ?? "Čuvanje nije uspelo. Pokušajte ponovo.");
    }
  };

  if (isEdit && loadingExisting) return <LoadingSpinner />;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 d-print-none">
        <h4 className="mb-0">
          {isEdit ? "Izmeni uplatnicu" : "Nova uplatnica"}
        </h4>
        <Button variant="outline-secondary" onClick={() => window.print()}>
          Štampaj
        </Button>
      </div>

      <FormErrorAlert message={formError} />

      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Saved recipient picker */}
        <div className="d-print-none">
          <RecipientSelect
            recipients={recipients ?? []}
            onPick={handleRecipientPick}
          />
        </div>

        {/* Payment slip card */}
        <Card className="payment-slip border-dark mb-4">
          <Card.Body>
            <Row>
              {/* Left column — uplatilac + primalac */}
              <Col md={7} className="border-end">
                {/* Uplatilac */}
                <div className="mb-3">
                  <div className="fw-bold small text-uppercase text-muted mb-1">
                    Uplatilac
                  </div>
                  <TextField
                    label="Ime i prezime / naziv"
                    registration={register("sender_name")}
                    error={errors.sender_name}
                  />
                  <TextField
                    label="Adresa"
                    registration={register("sender_address")}
                    error={errors.sender_address}
                  />
                </div>

                <hr />

                {/* Primalac */}
                <div className="mb-3">
                  <div className="fw-bold small text-uppercase text-muted mb-1">
                    Primalac
                  </div>
                  <TextField
                    label="Ime i prezime / naziv"
                    registration={register("recipient_full_name")}
                    error={errors.recipient_full_name}
                  />
                  <TextField
                    label="Adresa"
                    registration={register("recipient_address")}
                    error={errors.recipient_address}
                  />
                  <TextField
                    label="Tekući račun primaoca"
                    registration={register("bank_account")}
                    error={errors.bank_account}
                    placeholder="160-123456789-17"
                  />
                </div>
              </Col>

              {/* Right column — svrha, šifra, model, iznos */}
              <Col md={5}>
                <TextField
                  label="Svrha uplate"
                  registration={register("payment_purpose")}
                  error={errors.payment_purpose}
                />
                <TextField
                  label="Šifra plaćanja"
                  registration={register("payment_code")}
                  error={errors.payment_code}
                  placeholder="npr. 289"
                />
                <Row>
                  <Col xs={4}>
                    <TextField
                      label="Model"
                      registration={register("reference_model")}
                      error={errors.reference_model}
                      placeholder="97"
                    />
                  </Col>
                  <Col xs={8}>
                    <TextField
                      label="Poziv na broj"
                      registration={register("reference_number")}
                      error={errors.reference_number}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xs={7}>
                    <TextField
                      label="Iznos"
                      registration={register("amount")}
                      error={errors.amount}
                      type="number"
                      placeholder="0.00"
                    />
                  </Col>
                  <Col xs={5}>
                    <SelectField
                      label="Valuta"
                      registration={register("currency")}
                      options={CURRENCY_OPTIONS}
                      error={errors.currency}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action buttons — hidden on print */}
        <div className="d-flex gap-2 d-print-none">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Sačuvaj"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/history")}
            disabled={isSubmitting}
          >
            Otkaži
          </Button>
        </div>
      </Form>
    </>
  );
};

export default PaymentOrderEditPage;
