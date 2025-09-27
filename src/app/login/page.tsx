"use client";

import * as React from "react";
import { Box, Card, Stack, Container, Alert } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store"; // adjust path if different
import { logIn } from "@/redux/features/Auth/authSlice"; // the thunk we created earlier
import LabeledTextField from "@/components/core/LabeledTextField";
import PrimaryButton from "@/components/core/PrimaryButton";
import styles from "./style.module.scss";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LanguageConstants from "@/constants/languageConstants";

type Values = { email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;

const emailRegex =
  // RFC5322-lite is overkill—keep it simple and predictable
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error: apiError } = useSelector((s: RootState) => s.auth);

  const [values, setValues] = React.useState<Values>({
    email: "",
    password: "",
  });
  const [touched, setTouched] = React.useState<Record<keyof Values, boolean>>({
    email: false,
    password: false,
  });
  const [errors, setErrors] = React.useState<Errors>({});

  function validate(v: Values): Errors {
    const e: Errors = {};
    if (!v.email.trim())
      e.email = LanguageConstants.SIGNIN_PAGE.ERRORS.EMAIL_REQUIRED;
    else if (!emailRegex.test(v.email))
      e.email = LanguageConstants.SIGNIN_PAGE.ERRORS.EMAIL_INVALID;

    if (!v.password.trim())
      e.password = LanguageConstants.SIGNIN_PAGE.ERRORS.PASSWORD_REQUIRED;
    else if (v.password.length < 6)
      e.password = LanguageConstants.SIGNIN_PAGE.ERRORS.PASSWORD_MIN;
    return e;
  }

  function handleChange<K extends keyof Values>(key: K) {
    return (evt: React.ChangeEvent<HTMLInputElement>) => {
      const next = { ...values, [key]: evt.target.value };
      setValues(next);
      // live-validate the touched field
      if (touched[key]) setErrors(validate(next));
    };
  }

  function handleBlur<K extends keyof Values>(key: K) {
    return () => {
      setTouched((t) => ({ ...t, [key]: true }));
      setErrors(validate(values));
    };
  }

  async function handleSubmit() { 
  const v = validate(values);
  setErrors(v);
  setTouched({ email: true, password: true });
  if (Object.keys(v).length > 0) return;

  try {
    const res = await dispatch(
      logIn({ username: values.email, password: values.password })
    );

    console.log("Login result:", res);

    if (logIn.fulfilled.match(res)) {
      console.log('here')
      router.push("/calls");
    } else {
      toast.error(LanguageConstants.SIGNIN_PAGE.TOAST.LOGIN_FAILED);
    }
  } catch (err) {
    console.error("Login error", err);
    toast.error(LanguageConstants.SIGNIN_PAGE.TOAST.LOGIN_FAILED);
  }
}


  const isLoading = status === "loading";

  return (
    <Container maxWidth={false} className={styles.container}>
      <Card elevation={4} className={styles.card}>
        <Box className={styles.form}>
          {apiError && <Alert severity="error">{apiError}</Alert>}

          <Stack className={styles.fields}>
            <LabeledTextField
              id="email"
              label={LanguageConstants.SIGNIN_PAGE.USERNAME_LABEL}
              placeholder={LanguageConstants.SIGNIN_PAGE.USERNAME_PLACEHOLDER}
              type="email"
              required
              icon={<AccountCircleIcon />}
              value={values.email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email ? errors.email : ""}
              autoComplete="username"
            />

            <LabeledTextField
              id="password"
              label={LanguageConstants.SIGNIN_PAGE.PASSWORD_LABEL}
              placeholder={LanguageConstants.SIGNIN_PAGE.PASSWORD_PLACEHOLDER}
              type="password"
              required
              icon={<LockIcon />}
              value={values.password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              error={touched.password && Boolean(errors.password)}
              helperText={
                touched.password && errors.password ? errors.password : ""
              }
              autoComplete="current-password"
            />
          </Stack>

          <Box className={styles.actions}>
            <PrimaryButton
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading
                ? LanguageConstants.SIGNIN_PAGE.BUTTON.LOGGING_IN
                : LanguageConstants.SIGNIN_PAGE.BUTTON.LOGIN}
            </PrimaryButton>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
