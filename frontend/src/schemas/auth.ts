import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().required("Email je obavezan"),
  password: yup.string().required("Lozinka je obavezna"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
  email: yup
    .string()
    .email("Unesite ispravnu email adresu")
    .required("Email je obavezan"),
  password: yup.string().required("Lozinka je obavezna"),
  full_name: yup.string().required("Ime i prezime je obavezno"),
  address: yup.string().required("Adresa je obavezna"),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;

export const changePasswordSchema = yup.object({
  old_password: yup.string().required("Stara lozinka je obavezna"),
  new_password: yup.string().required("Nova lozinka je obavezna"),
});

export type ChangePasswordFormValues = yup.InferType<
  typeof changePasswordSchema
>;
