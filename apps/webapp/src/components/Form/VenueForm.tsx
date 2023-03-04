import { Venue } from "@diplomski/gql/graphql";
import { lazy, useCallback } from "react";
import { DEFAULT_FORM_CLASSNAME } from "src/utils/form";
import { useFormik } from "formik";
import * as Yup from "yup";

const Input = lazy(() => import("@diplomski/components/Form/Input"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const SearchBox = lazy(() => import("@diplomski/components/SearchBox"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

interface Props {
  venue?: Venue;
  title: string;
  onSubmit: (values: any) => void
  initialValues: {
    id?: number;
    name: string;
    address: string;
    picture: string;
    latitude: number;
    longitude: number;
  },
  buttonText: string;
  defaultValue?: string;
}

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
});

export default function VenueForm({ title, venue, onSubmit, initialValues, buttonText, defaultValue }: Props) {
  const {
    values,
    handleChange,
    errors,
    setFieldError,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: onSubmit, 
    enableReinitialize: venue ? true : false,
    validationSchema
  });

    const onSelectAddress = useCallback(
    (address: string, latitude: number | null, longitude: number | null) => {
      handleChange({
        target: {
          name: "address",
          value: address,
        },
      });

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
    },
    [handleChange]
  );

  return (
    <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <Input
        name="name"
        label="Name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="New vanue name"
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
        defaultValue={defaultValue}
      />
      <Button
        loading={isSubmitting}
        disabled={!isValid || isSubmitting || !dirty}
        onClick={handleSubmit}
      >
        {buttonText}
      </Button>
    </form>
  );
};
