import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { loginSchema, type LoginFormValues } from "../schemas/auth";
import { useAuth } from "../auth/useAuth";
import { applyApiErrors } from "../api/errors";
import { FormErrorAlert } from "../components/FormErrorAlert";
import { TextField } from "../components/fields/TextField";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      const msg = applyApiErrors(err, setError);
      setFormError(msg ?? "Prijavljivanje nije uspelo.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: 420 }} className="p-4 shadow-sm">
        <h4 className="mb-4 text-center">Prijava</h4>
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
          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Prijavi se"
            )}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small>
            Nemate nalog? <Link to="/register">Registrujte se</Link>
          </small>
        </div>
      </Card>
    </Container>
  );
};

export default LoginPage;
