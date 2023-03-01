import { Spinner } from "@diplomski/components/Spinner";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import { DEFAULT_FORM_CLASSNAME } from "@diplomski/utils/form";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback, useEffect, useMemo } from "react";
import * as Yup from "yup";

const Header = lazy(() => import("@diplomski/components/Header"));
const Input = lazy(() => import("@diplomski/components/Form/Input"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const SearchBox = lazy(() => import("@diplomski/components/SearchBox"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

const DEFAULT_COORDINATE_MESSAGE =
  "We could not get coordinates for the following address. Please try again.";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .test(
      "name",
      "Name must be at least 2 characters long",
      (value) => value?.length > 1
    ),
  picture: Yup.string().required("Picture is required"),
  address: Yup.string().required("Address is required"),
  latitude: Yup.number()
    .min(-90, DEFAULT_COORDINATE_MESSAGE)
    .max(90, DEFAULT_COORDINATE_MESSAGE)
    .required(DEFAULT_COORDINATE_MESSAGE),
  longitude: Yup.number()
    .min(-180, DEFAULT_COORDINATE_MESSAGE)
    .max(180, DEFAULT_COORDINATE_MESSAGE)
    .required(DEFAULT_COORDINATE_MESSAGE),
});

export default function AddVenuePage() {
  const { addVenue, result } = useAddVenue();
  const router = useRouter();

  const {
    dirty,
    values,
    errors,
    handleChange,
    handleSubmit,
    isValid,
    isSubmitting,
    setFieldError,
    validateField,
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
      handleChange({
        target: {
          name: "address",
          value: address,
        },
      });

      if (latitude && longitude) {
        handleChange({
          target: {
            name: "latitude",
            value: latitude,
          },
        });

        handleChange({
          target: {
            name: "longitude",
            value: longitude,
          },
        });
      }
    },
    [handleChange]
  );

  useEffect(() => {
    if (dirty) {
      validateField("address");
      validateField("latitude");
      validateField("longitude");
    }
  }, [values.address, values.latitude, values.longitude, validateField, dirty]);

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
        <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
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
            disabled={!dirty || !isValid || isSubmitting}
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
