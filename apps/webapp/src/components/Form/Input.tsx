import { ChangeEvent, FC, useMemo } from "react";
import { clsx } from "clsx";

export interface Props {
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  hidden?: boolean;
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
  hidden = false,
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
      id: name,
      autoComplete: "off",
      hidden,
    }),
    [error, name, onChange, placeholder, type, value, hidden]
  );

  return (
    <div className="flex flex-col">
      {label && (
        <label hidden={hidden} htmlFor={name} className="font-bold text-white">
          {label}
        </label>
      )}
      {multiline ? <textarea {...props} /> : <input {...props} />}
      {error && <span className="text-red-500 italic">{error}</span>}
    </div>
  );
};

export default Input;
