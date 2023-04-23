import clsx from "clsx";

type TData = number | string | readonly string[] | undefined;

interface SelectOption {
  label: string;
  value: TData;
}

interface Props {
  value: TData;
  onChange: (value: TData) => void;
  transform?: (value: unknown) => TData;
  options: SelectOption[];
  label?: string;
  name?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function Select({
  value,
  onChange,
  transform,
  options,
  label,
  name,
  error,
  placeholder,
  disabled,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-white">
          {label}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={(e) => {
          const { value } = e.target;
          onChange(transform ? transform(value) : value);
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
          },
        ])}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => (
          <option
            key={`${name}-${index}`}
            value={option.value}
            disabled={disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
