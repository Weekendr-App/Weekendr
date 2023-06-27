import useCategories from "@diplomski/hooks/useCategories";
import { DEFAULT_FORM_CLASSNAME } from "@diplomski/utils/form";
import { isAfter } from "date-fns";
import { useFormik } from "formik";
import { isEmpty } from "ramda";
import { lazy, useCallback, useMemo, useState } from "react";
import * as Yup from "yup";

const Input = lazy(() => import("@diplomski/components/Form/Input"));
const DatePicker = lazy(() => import("@diplomski/components/Form/DatePicker"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));
const Select = lazy(() => import("@diplomski/components/Form/Select"));

export interface EventFormValues {
  name: string;
  description: string;
  picture: string;
  startDate: Date;
  endDate: Date;
  price: number;
  categoryId: number;
}

interface Props {
  title: string;
  onSubmit: (values: EventFormValues) => void;
  buttonText: string;
  initialValues?: EventFormValues;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Title is required"),
  description: Yup.string().optional(),
  picture: Yup.string().optional(),
  startDate: Yup.date()
    .required("Start date is required")
    .test("startDate", "Start date must be in the future", (startDate) => {
      return isAfter(startDate, new Date());
    }),
  endDate: Yup.date()
    .required("End date is required")
    .test(
      "endDate",
      "End date must be after start date",
      (endDate, { parent: { startDate } }) => {
        return isAfter(endDate, startDate);
      }
    ),
  price: Yup.number()
    .min(0, "Price must be 0 or greater")
    .typeError("Invalid price"),
  categoryId: Yup.number()
    .integer("Invalid category")
    .min(1, "Invalid category")
    .typeError("Invalid category")
    .required("Category is required"),
});

export default function EventForm({
  title,
  onSubmit,
  buttonText,
  initialValues,
}: Props) {
  const { categories } = useCategories();
  const [isPriceHidden, setIsPriceHidden] = useState(true);

  const enableReinitialize = useMemo(
    () => initialValues !== undefined,
    [initialValues]
  );

  const {
    values,
    handleChange,
    errors,
    handleSubmit,
    isSubmitting,
    isValid,
    dirty,
    setFieldError,
  } = useFormik({
    initialValues: initialValues || {
      name: "",
      description: "",
      picture: "",
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      categoryId: 0,
    },
    onSubmit,
    enableReinitialize,
    validationSchema,
  });

  const handlePriceButtonClick = useCallback(() => {
    if (isPriceHidden) {
      setIsPriceHidden(() => false);
    } else {
      // When the price is removed, we need to set the value to 0.
      // The reason for this is that we may have set a price before
      // and decided to remove it. If we don't set the value to 0,
      // the form will still contain the old value.
      setIsPriceHidden(() => true);
      handleChange({
        target: {
          name: "price",
          value: 0,
        },
      });
    }
  }, [isPriceHidden, handleChange]);

  return (
    <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
      <h1 className="text-2xl font-bold">{title}</h1>
      <Input
        name="name"
        label="Name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        disabled={isSubmitting}
        placeholder="Event name"
      />
      <Input
        name="description"
        label="Description (optional)"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Event description"
        disabled={isSubmitting}
        multiline
      />
      <Input
        hidden={isPriceHidden}
        name="price"
        label="Price of admission (€)"
        value={values.price}
        onChange={handleChange}
        type="number"
        error={errors.price}
        disabled={isSubmitting}
        placeholder="Event price in €"
      />
      <Button disabled={isSubmitting} onClick={handlePriceButtonClick}>
        {isPriceHidden ? "Add price" : "Remove price"}
      </Button>

      <FileUpload
        name="picture"
        label="Picture (optional)"
        value={values.picture}
        onChange={handleChange}
        onError={setFieldError}
        error={errors.picture}
        disabled={isSubmitting}
      />

      <div className="flex justify-between gap-4 flex-wrap">
        <DatePicker
          name="startDate"
          label="Start date"
          value={values.startDate}
          error={errors.startDate}
          disabled={isSubmitting}
          onChange={(date: Date) =>
            handleChange({ target: { name: "startDate", value: date } })
          }
        />
        <DatePicker
          name="endDate"
          label="End date"
          value={values.endDate}
          error={errors.endDate}
          disabled={isSubmitting}
          onChange={(date: Date) =>
            handleChange({ target: { name: "endDate", value: date } })
          }
        />
      </div>

      <Select
        value={values.categoryId}
        onChange={(value) =>
          handleChange({ target: { name: "categoryId", value } })
        }
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        name="categoryId"
        label="Event category"
        placeholder="Select category"
        error={errors.categoryId}
        disabled={isSubmitting || isEmpty(categories)}
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
