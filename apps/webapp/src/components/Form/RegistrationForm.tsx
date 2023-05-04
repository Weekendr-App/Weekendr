import { useFormik } from "formik";
import * as Yup from "yup";
import { DEFAULT_FORM_CLASSNAME } from "src/utils/form";
import { lazy, Suspense } from "react";
import { Spinner } from "../Spinner";
import useSignUp from "@diplomski/hooks/useSignUp";
import { useRouter } from "next/router";

const Input = lazy(() => import("./Input"));
const FileUpload = lazy(() => import("./FileUpload"));
const Button = lazy(() => import("./Button"));

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email is not valid")
    .required("Email is required")
    .test("tld", "Email is not valid", (value) =>
      /\.[a-z]{2,}(?=\s|$)/.test(value)
    ),
  password: Yup.string()
    .required("Password is required")
    .test(
      "password",
      "Password must be at least 8 characters long",
      (value) => value?.length >= 8
    ),
  taxReturnsPicture: Yup.string().required(
    "Picture of tax returns is required"
  ),
});

export default function RegistrationForm() {
  const { signUp } = useSignUp();
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
      router.push('/info');
    },
    initialValues: {
      email: "",
      password: "",
      taxReturnsPicture: "",
    },
    validationSchema,
  });

  return (
    <Suspense fallback={<Spinner />}>
      <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
        <h1 className="text-2xl font-bold text-white">Sign Up</h1>
        <Input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Email"
        />
        <Input
          label="Password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Password"
          type="password"
        />
        <FileUpload
          name="taxReturnsPicture"
          label="Picture of Tax Returns (We need proof you actually own the venue)"
          value={values.taxReturnsPicture}
          onChange={handleChange}
          onError={setFieldError}
          error={errors.taxReturnsPicture}
        />
        <Button
          loading={isSubmitting}
          disabled={!isValid || isSubmitting || !dirty}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </form>
    </Suspense>
  );
}
