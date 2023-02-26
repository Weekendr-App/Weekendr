import { Spinner } from "@diplomski/components/Spinner";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense } from "react";
import * as Yup from "yup";

const Header = lazy(() => import("@diplomski/components/Header"));
const Input = lazy(() => import("@diplomski/components/Form/Input"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  picture: Yup.string().required("Picture is required"),
});

export default function AddVenuePage() {
  const { addVenue, result } = useAddVenue();
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
      name: "",
      picture: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await addVenue(values);
    },
  });

  if (result.data?.createVenue?.id) {
    router.push(`/venues/${result.data.createVenue.id}`);
  }

  return (
    <>
      <Head>
        <title>Add Venue</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <Header />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-1/2 mx-auto mt-10 border border-gray-300 p-4 rounded-md shadow-md"
        >
          <h1 className="text-2xl font-bold">Add Venue</h1>
          <Input
            name="name"
            label="Name"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Venue name"
          />
          <FileUpload
            name="picture"
            label="Picture"
            value={values.picture}
            onChange={handleChange}
            onError={setFieldError}
            error={errors.picture}
          />
          <Button
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Add
          </Button>
        </form>
      </Suspense>
    </>
  );
}
