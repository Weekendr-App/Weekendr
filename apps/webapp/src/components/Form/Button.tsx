import clsx from "clsx";
import { FC, PropsWithChildren } from "react";
import { Spinner } from "../Spinner";

interface Props {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const Button: FC<PropsWithChildren<Props>> = ({
  children,
  disabled,
  loading,
  onClick,
}) => {
  return (
    <button
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
      type="submit"
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
