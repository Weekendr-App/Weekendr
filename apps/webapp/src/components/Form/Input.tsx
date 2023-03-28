import { ChangeEvent, FC, useMemo } from "react";
import { clsx } from "clsx";

export interface Props {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}

const Input: FC<Props> = ({
  name,
  value,
  onChange,
  error,
  label,
  type = "text",
  placeholder,
  multiline = false,
}) => {
  const props = useMemo(
    () => ({
      className: clsx(["border", "border-gray-300", "p-2", "rounded-md"], {
        "border-red-500": error,
      }),
      name,
      value,
      onChange,
      type,
      placeholder,
    }),
    [error, name, onChange, placeholder, type, value]
  );

  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold text-white">
          {label}
        </label>
      )}
      {multiline ? <textarea {...props} /> : <input {...props} />}
      <input
        className={clsx(["border", "border-gray-300", "p-2", "rounded-md"], {
          "border-red-500": error,
        })}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        autoComplete="off"
      />
      {error && <span className="text-red-500 italic">{error}</span>}
    </div>
  );
};

export default Input;
