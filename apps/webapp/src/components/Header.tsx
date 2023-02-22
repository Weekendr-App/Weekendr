import { FC } from "react";
import { clsx } from "clsx";

const Header: FC<{}> = () => {
  return (
    <header
      className={clsx([
        "bg-indigo-600",
        "text-white",
        "text-2xl",
        "font-bold",
        "p-4",
      ])}
    >
      Diplomski
    </header>
  );
};

export default Header;
