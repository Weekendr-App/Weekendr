import clsx from "clsx";
import { FC, PropsWithChildren } from "react";
import { Spinner } from "../Spinner";

interface Props {
  type?: "submit" | "button";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  hidden?: boolean | undefined;
}

const Button: FC<PropsWithChildren<Props>> = ({
  type = "submit",
  children,
  disabled,
  loading,
  onClick,
  hidden = false
}) => {
  return (
    <button
      hidden={hidden}
      className={clsx([
        "bg-gray-800",
        "text-white",
        "font-bold",
        "py-2",
        "px-4",
        "rounded",
        "focus:outline-none",
        "focus:shadow-outline",
        {
          "opacity-50": disabled || loading,
          "cursor-not-allowed": disabled || loading,
        },
      ])}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
