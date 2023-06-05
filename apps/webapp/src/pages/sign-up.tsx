import { useFormik } from "formik";
import * as Yup from "yup";
import { DEFAULT_FORM_CLASSNAME } from "src/utils/form";
import { lazy, Suspense, useEffect } from "react";
import useSignUp from "@diplomski/hooks/useSignUp";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Spinner } from "@diplomski/components/Spinner";
import { AuthState, useAuth } from "@diplomski/hooks/useAuth";

const Input = lazy(() => import("@diplomski/components/Form/Input"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email is not valid")
    .required("Email is required")
    .test("tld", "Email is not valid", (value) =>
      /\.[a-z]{2,}(?=\s|$)/.test(value)
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  taxReturnsPicture: Yup.string()
    .required("Picture of tax returns is required")
    .url("Picture of tax returns is required"),
});

export default function SignUpPage() {
  const { authState } = useAuth();
  const { signUp, result } = useSignUp();
  const router = useRouter();
  const {
    values,
    handleSubmit,
    handleChange,
    errors,
    setFieldError,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    onSubmit: async (values) => {
      await signUp(values);
    },
    initialValues: {
      email: "",
      password: "",
      taxReturnsPicture: "",
    },
    validationSchema,
  });

  useEffect(() => {
    if (result && result.data) {
      const {
        registerUser: { success, message },
      } = result.data;

      if (!success) {
        setFieldError("email", message);
      }
    }
  }, [result, setFieldError]);

  if (authState === AuthState.AUTHENTICATED) {
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
          <h1 className="text-2xl font-bold text-white">Sign Up</h1>
          <Input
            name="email"
            type="email"
            label="Email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isSubmitting}
            placeholder="Email"
          />
          <Input
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isSubmitting}
            placeholder="Password"
            type="password"
          />
          <FileUpload
            name="taxReturnsPicture"
            label="Tax Returns picture (Proof of Ownership)"
            value={values.taxReturnsPicture}
            onChange={handleChange}
            onError={setFieldError}
            disabled={isSubmitting}
            error={errors.taxReturnsPicture}
          />
          <Button
            loading={isSubmitting}
            disabled={!isValid || isSubmitting || !dirty}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <div className="text-white">
            Already have an account?{" "}
            <Link className="font-bold hover:underline" href="/auth">
              Login
            </Link>
          </div>
        </form>
      </Suspense>
    </>
  );
}
