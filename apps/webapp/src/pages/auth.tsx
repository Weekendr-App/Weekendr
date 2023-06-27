import { Spinner } from "@diplomski/components/Spinner";
import { AuthState, useAuth } from "@diplomski/hooks/useAuth";
import { DEFAULT_FORM_CLASSNAME } from "@diplomski/utils/form";
import { useFormik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { lazy, Suspense, useEffect } from "react";
import { useDarkMode } from "usehooks-ts";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email is not valid")
    .required("Email is required")
    .test("tld", "Email is not valid", (value) =>
      /\.[a-z]{2,}(?=\s|$)/.test(value)
    ),
  password: Yup.string().required("Password is required"),
});

const Input = lazy(() => import("@diplomski/components/Form/Input"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

export default function Auth() {
  const { authState, user, login } = useAuth();
  const router = useRouter();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isValid,
    isSubmitting,
    setFieldError,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await login(values.email, values.password);
    },
  });
  const { isDarkMode } = useDarkMode();

  if (user) {
    router.push("/");
  }

  useEffect(() => {
    switch (authState) {
      case AuthState.WRONG_CREDENTIALS:
        setFieldError("email", "Wrong credentials");
        break;
      case AuthState.NOT_VERIFIED:
        setFieldError("email", "Email is not verified");
        break;
      default:
        break;
    }
  }, [authState, setFieldError]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div
        className={`${isDarkMode && "dark"}`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="h-full dark:bg-gray-900 bg-gray-200 pt-10">
          <Suspense fallback={<Spinner />}>
            <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
              <h1 className="text-2xl font-bold">Login</h1>
              <Input
                label="Email"
                name="email"
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
              <Button
                disabled={!isValid || isSubmitting}
                loading={isSubmitting || !!user}
                onClick={handleSubmit}
              >
                Login
              </Button>
              <div>
                Want to add your own venue to our website?{" "}
                <Link className="font-bold hover:underline" href="/sign-up">
                  Sign up
                </Link>
              </div>
            </form>
          </Suspense>
        </div>
      </div>
    </>
  );
}
