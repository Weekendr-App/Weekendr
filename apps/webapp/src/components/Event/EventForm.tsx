import useCategories from "@diplomski/hooks/useCategories";
import { DEFAULT_FORM_CLASSNAME } from "@diplomski/utils/form";
import { isAfter } from "date-fns";
import { useFormik } from "formik";
import { lazy, useMemo, useState } from "react";
import * as Yup from "yup";
import Select from "../Form/Select";

const Input = lazy(() => import("@diplomski/components/Form/Input"));
const DatePicker = lazy(() => import("@diplomski/components/Form/DatePicker"));
const FileUpload = lazy(() => import("@diplomski/components/Form/FileUpload"));
const Button = lazy(() => import("@diplomski/components/Form/Button"));

export interface EventFormValues {
  name: string;
  description?: string;
  picture?: string;
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
      startDate: new Date(),
      endDate: new Date(),
      price: 0,
      categoryId: "",
    },
    onSubmit,
    enableReinitialize,
    validationSchema,
  });

  return (
    <form onSubmit={handleSubmit} className={DEFAULT_FORM_CLASSNAME}>
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <Button hidden={!isPriceHidden} onClick={() => setIsPriceHidden(false)}>
        Set Price of Admission (optional)
      </Button>
      <Input
        hidden={isPriceHidden}
        name="price"
        label="Price of admission (€)"
        value={values.price}
        onChange={handleChange}
        type="number"
        error={errors.price}
        placeholder="Event price in €"
      />
      <Input
        name="name"
        label="Name"
        value={values.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Event name"
      />
      <Input
        name="description"
        label="Description (optional)"
        value={values.description ?? ""}
        onChange={handleChange}
        error={errors.description}
        placeholder="Event description"
        multiline
      />
      <FileUpload
        name="picture"
        label="Picture (optional)"
        value={values.picture ?? ""}
        onChange={handleChange}
        onError={setFieldError}
        error={errors.picture}
      />

      <div className="flex justify-between gap-4 flex-wrap">
        <DatePicker
          name="startDate"
          label="Start date"
          value={values.startDate}
          error={errors.startDate}
          onChange={(date: Date) =>
            handleChange({ target: { name: "startDate", value: date } })
          }
        />
        <DatePicker
          name="endDate"
          label="End date"
          value={values.endDate}
          error={errors.endDate}
          onChange={(date: Date) =>
            handleChange({ target: { name: "endDate", value: date } })
          }
        />
      </div>
      <Select
        value={values.categoryId}
        transform={(v) => Number(v)}
        onChange={(value) =>
          handleChange({ target: { name: "categoryId", value } })
        }
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        name="categoryId"
        label="Event category"
        placeholder="Select category"
        error={errors.categoryId}
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
