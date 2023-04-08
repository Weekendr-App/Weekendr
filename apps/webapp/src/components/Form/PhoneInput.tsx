import clsx from "clsx";
import Input, { Value, Country } from "react-phone-number-input";
import { Props } from "./Input";

interface PhoneProps extends Partial<Omit<Props, "onChange" | "type">> {
  onChange: (value: Value | undefined) => void;
  defaultCountry?: Country | undefined;
  onCountryChange: (value: Country) => void;
}

export default function PhoneInput({
  error,
  name,
  label,
  value,
  onChange,
  placeholder,
  defaultCountry,
  onCountryChange,
}: PhoneProps) {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold text-white">
          {label}
        </label>
      )}
      <Input
        className={clsx(
          ["border", "border-gray-300", "bg-white", "p-2", "rounded-md"],
          {
            "border-red-500": error,
          }
        )}
        id={name}
        autoComplete="off"
        name={name}
        error={error}
        placeholder={placeholder}
        value={`${value}`}
        onChange={onChange}
        defaultCountry={defaultCountry}
        onCountryChange={onCountryChange}
      />
      {error && <span className="text-red-500 italic">{error}</span>}
    </div>
  );
}
