import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { profileSchema, type ProfileFormValues } from "../schemas/profile";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas/auth";
import { USERS_ME, AUTH_PASSWORD_CHANGE } from "../api/endpoints";
import instance from "../api/axios";
import { useAuth } from "../auth/useAuth";
import { applyApiErrors } from "../api/errors";
import { TextField } from "../components/fields/TextField";
import { FormErrorAlert } from "../components/FormErrorAlert";

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileError, setProfileError] = useState<string | null>(null);
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    setError: setProfileFieldError,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileFormValues>({ resolver: yupResolver(profileSchema) });

  useEffect(() => {
    if (user) {
      resetProfile({ full_name: user.full_name, address: user.address });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    setProfileError(null);
    try {
      const result = await instance.patch(USERS_ME, values);
      resetProfile({
        full_name: result.data.full_name,
        address: result.data.address,
      });
      navigate("/history");
    } catch (err) {
      const msg = applyApiErrors(err, setProfileFieldError);
      setProfileError(msg ?? "Čuvanje nije uspelo. Pokušajte ponovo.");
    }
  };

  // ── Change password form ────────────────────────────────────────────────
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    setError: setPasswordFieldError,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),
  });

  const onPasswordSubmit = async (values: ChangePasswordFormValues) => {
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      await instance.post(AUTH_PASSWORD_CHANGE, values);
      resetPassword();
      setPasswordSuccess(true);
    } catch (err) {
      const msg = applyApiErrors(err, setPasswordFieldError);
      setPasswordError(msg ?? "Promena lozinke nije uspela. Pokušajte ponovo.");
    }
  };

  return (
    <>
      <h4 className="mb-4">Moj profil</h4>

      {/* Account details */}
      <Card className="p-4 shadow-sm mb-4" style={{ maxWidth: 520 }}>
        <h5 className="mb-3">Lični podaci</h5>
        <div className="mb-3">Email: {user?.email ?? ""}</div>
        <FormErrorAlert message={profileError} />
        <Form noValidate onSubmit={handleProfile(onProfileSubmit)}>
          <TextField
            label="Ime i prezime"
            registration={regProfile("full_name")}
            error={profileErrors.full_name}
          />
          <TextField
            label="Adresa"
            registration={regProfile("address")}
            error={profileErrors.address}
          />
          <Button type="submit" variant="primary" disabled={profileSubmitting}>
            {profileSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Sačuvaj"
            )}
          </Button>
        </Form>
      </Card>

      {/* Change password */}
      <Card className="p-4 shadow-sm" style={{ maxWidth: 520 }}>
        <h5 className="mb-3">Promena lozinke</h5>
        {passwordSuccess && (
          <Alert variant="success">Lozinka je uspešno promenjena.</Alert>
        )}
        <FormErrorAlert message={passwordError} />
        <Form noValidate onSubmit={handlePassword(onPasswordSubmit)}>
          <TextField
            label="Stara lozinka"
            registration={regPassword("old_password")}
            error={passwordErrors.old_password}
            type="password"
          />
          <TextField
            label="Nova lozinka"
            registration={regPassword("new_password")}
            error={passwordErrors.new_password}
            type="password"
          />
          <Button type="submit" variant="primary" disabled={passwordSubmitting}>
            {passwordSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Promeni lozinku"
            )}
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ProfilePage;
