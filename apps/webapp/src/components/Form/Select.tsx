import clsx from "clsx";

interface SelectOption<TValue> {
  label: string;
  value: TValue;
}

interface Props<TOption = string | number> {
  value: TOption;
  onChange: (value: TOption) => void;
  transform?: (value: unknown) => TOption;
  options: SelectOption<TOption>[];
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
              "pointer-events-none": disabled,
            },
          ])}
        >
          {placeholder && (
            <option value={0} disabled>
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
      </div>
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
