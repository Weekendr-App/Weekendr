import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Props as InputProps } from "@diplomski/components/Form/Input";
import { FC } from "react";
import { FormikErrors } from "formik";
import clsx from "clsx";

interface Props
  extends Omit<InputProps, "multiline" | "value" | "onChange" | "error"> {
  value: Date;
  onChange: (date: Date) => void;
  error?: FormikErrors<Date>;
}

const DatePicker: FC<Props> = ({
  name,
  value,
  onChange,
  error,
  label,
  disabled,
}) => {
  return (
    <div className="flex flex-col sm:w-full lg:w-60">
      {label && (
        <label htmlFor={name} className="font-bold text-white">
          {label}
        </label>
      )}
      <div
        className={clsx("flex flex-col", {
          "opacity-50": disabled,
          "hover:cursor-not-allowed": disabled,
        })}
      >
        <ReactDatePicker
          name={name}
          disabled={disabled}
          selected={value}
          onChange={onChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          className="border border-gray-300 p-2 rounded-md w-full"
        />
      </div>
      {error && <span className="text-red-500 italic">{error as string}</span>}
    </div>
  );
};

export default DatePicker;
