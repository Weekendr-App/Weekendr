import { Spinner } from "@diplomski/components/Spinner";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback } from "react";
import * as Yup from "yup";

const Header = lazy(() => import("@diplomski/components/Header"));
const Input = lazy(() => import("@diplomski/components/Form/Input"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const SearchBox = lazy(() => import("@diplomski/components/SearchBox"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  picture: Yup.string().required("Picture is required"),
  address: Yup.string().required("Address is required"),
  latitude: Yup.number().min(-90).max(90).required("Latitude is required"),
  longitude: Yup.number().min(-180).max(180).required("Longitude is required"),
});

export default function AddVenuePage() {
  const { addVenue, result } = useAddVenue();
  const router = useRouter();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    isValid,
    isSubmitting,
    setFieldError,
  } = useFormik({
    initialValues: {
      name: "",
      picture: "",
      address: "",
      latitude: 0,
      longitude: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      await addVenue(values);
    },
  });

  const onSelectAddress = useCallback(
    (address: string, latitude: number | null, longitude: number | null) => {
      setFieldValue("address", address);
      setFieldValue("latitude", latitude);
      setFieldValue("longitude", longitude);
    },
    [setFieldValue]
  );

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
          <SearchBox
            name="address"
            label="Address"
            error={errors.address || errors.latitude || errors.longitude}
            onSelectAddress={onSelectAddress}
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
