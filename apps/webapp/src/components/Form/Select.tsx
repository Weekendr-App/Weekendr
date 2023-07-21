import clsx from "clsx";

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
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={name}>{label}</label>}
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
            "text-black",
            {
              "border-red-500": error,
              "pointer-events-none": disabled,
            },
          ])}
        >
          {placeholder && (
            <option className="text-black" value={defaultValue ?? 0} disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option
              key={`${name}-${index}`}
              value={option.value}
              disabled={disabled}
              className="text-black"
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
