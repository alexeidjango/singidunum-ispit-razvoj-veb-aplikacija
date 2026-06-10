import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { registerSchema, type RegisterFormValues } from "../schemas/auth";
import { useAuth } from "../auth/useAuth";
import { applyApiErrors } from "../api/errors";
import { FormErrorAlert } from "../components/FormErrorAlert";
import { TextField } from "../components/fields/TextField";
import instance from "../api/axios";
import { AUTH_REGISTER } from "../api/endpoints";

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setFormError(null);
    try {
      await instance.post(AUTH_REGISTER, values);
      // Auto-login after successful registration
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      const msg = applyApiErrors(err, setError);
      setFormError(msg ?? "Registracija nije uspela.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: 480 }} className="p-4 shadow-sm">
        <h4 className="mb-4 text-center">Registracija</h4>
        <FormErrorAlert message={formError} />
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            registration={register("email")}
            error={errors.email}
            type="email"
            placeholder="korisnik@primer.com"
          />
          <TextField
            label="Lozinka"
            registration={register("password")}
            error={errors.password}
            type="password"
          />
          <TextField
            label="Ime i prezime"
            registration={register("full_name")}
            error={errors.full_name}
            placeholder="Petar Petrović"
          />
          <TextField
            label="Adresa"
            registration={register("address")}
            error={errors.address}
            placeholder="Ulica i broj, Grad"
          />
          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Registruj se"
            )}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small>
            Već imate nalog? <Link to="/login">Prijavite se</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
};

export default RegisterPage;
