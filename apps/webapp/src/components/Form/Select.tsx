import clsx from "clsx";
import { useDarkMode } from "usehooks-ts";

interface SelectOption {
  label: string;
  value: string;
}

interface Props {
  value: number;
  defaultValue?: number;
  onChange: (value: number) => void;
  options: SelectOption[];
  label?: string;
  name?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function Select({
  value,
  defaultValue,
  onChange,
  options,
  label,
  name,
  error,
  placeholder,
  disabled,
}: Props) {
  const {isDarkMode} = useDarkMode();
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}
      <div
        className={clsx("flex", "flex-col", {
          "opacity-50": disabled,
          "cursor-not-allowed": disabled,
        })}
      >
        <select
          name={name}
          value={value}
          onChange={(e) => {
            const { value } = e.target;
            onChange(Number(value));
          }}
          className={clsx([
            "h-10",
            "border",
            "border-gray-300",
            "rounded",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-gray-600",
            "focus:border-transparent",
            {
              "border-red-500": error,
              "pointer-events-none": disabled,
              "bg-amber-50": !isDarkMode,
              "text-black": isDarkMode,
            },
          ])}
        >
          {placeholder && (
            <option className="dark:text-black" value={defaultValue ?? 0} disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option
              key={`${name}-${index}`}
              value={option.value}
              disabled={disabled}
              className="dark:text-black"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
