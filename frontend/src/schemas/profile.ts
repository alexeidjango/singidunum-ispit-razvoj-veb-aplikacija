import * as yup from "yup";

export const profileSchema = yup.object({
  full_name: yup.string().required("Ime i prezime je obavezno"),
  address: yup.string().required("Adresa je obavezna"),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
