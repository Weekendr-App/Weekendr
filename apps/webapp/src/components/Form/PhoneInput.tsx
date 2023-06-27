import clsx from "clsx";
import Input, { Value, Country } from "react-phone-number-input";
import { useDarkMode } from "usehooks-ts";
import { Props } from "./Input";

interface PhoneProps extends Partial<Omit<Props, "onChange" | "type">> {
  onChange: (value: Value | undefined) => void;
  defaultCountry?: Country;
  onCountryChange: (value: Country) => void;
}

export default function PhoneInput({
  error,
  name,
  label,
  value,
  onChange,
  placeholder,
  defaultCountry = "RS",
  onCountryChange,
  disabled,
}: PhoneProps) {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold">
          {label}
        </label>
      )}
      <Input
        className={clsx(
          ["border", "border-gray-300", "bg-white", "p-2", "rounded-md"],
          {
            "border-red-500": error,
            "text-black": isDarkMode,
          }
        )}
        id={name}
        autoComplete="off"
        name={name}
        error={error}
        readOnly={disabled}
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
