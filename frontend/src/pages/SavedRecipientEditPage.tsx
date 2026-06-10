import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import useAxios from "axios-hooks";
import {
  savedRecipientSchema,
  type SavedRecipientFormValues,
} from "../schemas/savedRecipient";
import { SAVED_RECIPIENTS, byId } from "../api/endpoints";
import instance from "../api/axios";
import type { SavedRecipient } from "../types";
import { TextField } from "../components/fields/TextField";
import { FormErrorAlert } from "../components/FormErrorAlert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { applyApiErrors } from "../api/errors";

const SavedRecipientEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined && id !== "new";
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const [{ data: existing, loading: loadingExisting }] =
    useAxios<SavedRecipient>(
      { url: isEdit ? byId(SAVED_RECIPIENTS, id!) : "" },
      { manual: !isEdit },
    );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SavedRecipientFormValues>({
    resolver: yupResolver(savedRecipientSchema),
  });

  useEffect(() => {
    if (existing) {
      reset({
        recipient_full_name: existing.recipient_full_name,
        recipient_address: existing.recipient_address,
        bank_account: existing.bank_account,
      });
    }
  }, [existing, reset]);

  const onSubmit = async (values: SavedRecipientFormValues) => {
    setFormError(null);
    try {
      if (isEdit) {
        await instance.put(byId(SAVED_RECIPIENTS, id!), values);
      } else {
        await instance.post(SAVED_RECIPIENTS, values);
      }
      navigate("/receivers");
    } catch (err) {
      const msg = applyApiErrors(err, setError);
      setFormError(msg ?? "Čuvanje nije uspelo. Pokušajte ponovo.");
    }
  };

  if (isEdit && loadingExisting) return <LoadingSpinner />;

  return (
    <Card className="p-4 shadow-sm" style={{ maxWidth: 560 }}>
      <h4 className="mb-4">{isEdit ? "Izmeni primaoca" : "Novi primalac"}</h4>
      <FormErrorAlert message={formError} />
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Ime primaoca"
          registration={register("recipient_full_name")}
          error={errors.recipient_full_name}
          placeholder="Naziv firme ili ime i prezime"
        />
        <TextField
          label="Adresa primaoca"
          registration={register("recipient_address")}
          error={errors.recipient_address}
          placeholder="Ulica i broj, Grad"
        />
        <TextField
          label="Broj tekućeg računa"
          registration={register("bank_account")}
          error={errors.bank_account}
          placeholder="160-123456789-17 ili 18 cifara"
        />
        <div className="d-flex gap-2 mt-3">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Sačuvaj"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate("/receivers")}
            disabled={isSubmitting}
          >
            Otkaži
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default SavedRecipientEditPage;
