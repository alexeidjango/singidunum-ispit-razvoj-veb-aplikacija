import * as yup from "yup";

export const paymentOrderSchema = yup.object({
  recipient_full_name: yup.string().required("Ime primaoca je obavezno"),
  recipient_address: yup.string().required("Adresa primaoca je obavezna"),
  bank_account: yup.string().required("Broj računa je obavezan"),
  sender_name: yup.string().required("Ime uplatioca je obavezno"),
  sender_address: yup.string().required("Adresa uplatioca je obavezna"),
  amount: yup
    .number()
    .typeError("Iznos mora biti broj")
    .required("Iznos je obavezan")
    .positive("Iznos mora biti veći od 0"),
  currency: yup
    .string()
    .oneOf(["RSD", "EUR", "USD"] as const)
    .required("Valuta je obavezna"),
  reference_model: yup.string().default(""),
  reference_number: yup.string().default(""),
  payment_purpose: yup.string().default(""),
  payment_code: yup.string().default(""),
});

// Explicit type — optional fields are always present due to schema defaults
export interface PaymentOrderFormValues {
  recipient_full_name: string;
  recipient_address: string;
  bank_account: string;
  sender_name: string;
  sender_address: string;
  amount: number;
  currency: "RSD" | "EUR" | "USD";
  reference_model: string;
  reference_number: string;
  payment_purpose: string;
  payment_code: string;
}
