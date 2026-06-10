import * as yup from "yup";

export const savedRecipientSchema = yup.object({
  recipient_full_name: yup.string().required("Ime primaoca je obavezno"),
  recipient_address: yup.string().required("Adresa primaoca je obavezna"),
  bank_account: yup.string().required("Broj računa je obavezan"),
});

export type SavedRecipientFormValues = yup.InferType<
  typeof savedRecipientSchema
>;
