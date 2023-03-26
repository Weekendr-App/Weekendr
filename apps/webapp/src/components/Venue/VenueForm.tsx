import { lazy, useCallback, useEffect, useMemo } from "react";
import { DEFAULT_FORM_CLASSNAME } from "src/utils/form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Country, Value } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "yup-phone-lite";

const Input = lazy(() => import("@diplomski/components/Form/Input"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const SearchBox = lazy(() => import("@diplomski/components/SearchBox"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));
const PhoneInput = lazy(() => import("@diplomski/components/Form/PhoneInput"));

const DEFAULT_COORDINATE_MESSAGE =
  "We could not get coordinates for the following address. Please try again.";

export interface VenueFormValues {
  name: string;
  picture: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  countryCode: Country | undefined;
}

interface Props {
  title: string;
  onSubmit: (values: VenueFormValues) => void;
  buttonText: string;
  initialValues?: VenueFormValues;
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
  latitude: Yup.number()
    .min(-90, DEFAULT_COORDINATE_MESSAGE)
    .max(90, DEFAULT_COORDINATE_MESSAGE)
    .required(DEFAULT_COORDINATE_MESSAGE),
  longitude: Yup.number()
    .min(-180, DEFAULT_COORDINATE_MESSAGE)
    .max(180, DEFAULT_COORDINATE_MESSAGE)
    .required(DEFAULT_COORDINATE_MESSAGE),
  countryCode: Yup.string().required("Country code is required"),
  phone: Yup.string()
    .test("phone", "Phone is not valid", (value, ctx) => {
      return value
        ? Yup.string().phone(ctx.parent.countryCode).isValidSync(value)
        : true;
    })
    .required("Phone is required"),
});

export default function VenueForm({
  title,
  onSubmit,
  initialValues,
  buttonText,
}: Props) {
  const enableReinitialize = useMemo(
    () => initialValues !== undefined,
    [initialValues]
  );

  const {
    values,
    handleChange,
    errors,
    setFieldError,
    handleSubmit,
    isSubmitting,
    validateField,
    isValid,
    dirty,
  } = useFormik({
    initialValues: initialValues || {
      name: "",
      picture: "",
      address: "",
      latitude: 0,
      longitude: 0,
      phone: "",
      countryCode: undefined,
    },
    onSubmit,
    enableReinitialize,
    validationSchema,
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

  const onPhoneChange = useCallback(
    (value: Value | undefined) => {
      handleChange({
        target: {
          name: "phone",
          value: value?.toString(),
        },
      });
    },
    [handleChange]
  );

  const onCountryChange = useCallback(
    (value: Country | undefined) => {
      handleChange({
        target: {
          name: "countryCode",
          value,
        },
      });
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

  return (
    <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
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
        placeholder="Venue address"
        value={values.address}
        error={errors.address || errors.latitude || errors.longitude}
        onSelectAddress={onSelectAddress}
      />
      <PhoneInput
        name="phone"
        label="Phone Number"
        error={errors.phone || errors.countryCode}
        placeholder="Venue phone number"
        value={values.phone}
        onChange={onPhoneChange}
        defaultCountry={values.countryCode}
        onCountryChange={onCountryChange}
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
}
