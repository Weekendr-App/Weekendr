import { ChangeEvent, FC } from "react";
import { clsx } from "clsx";

export interface Props {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
}

const Input: FC<Props> = ({
  name,
  value,
  onChange,
  error,
  label,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={name} className="font-bold text-white">
          {label}
        </label>
      )}
      <input
        className={clsx(["border", "border-gray-300", "p-2", "rounded-md"], {
          "border-red-500": error,
        })}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
      {error && <span className="text-red-500 italic">{error}</span>}
    </div>
  );
};

export default Input;
