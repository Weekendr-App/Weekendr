import clsx from "clsx";
import { toast } from "react-hot-toast";

interface Props {
  title: string;
  message: string;
  type?: "warning" | "info";
  onConfirm: () => Promise<void>;
  id: string;
}

export default function Dialog({
  title,
  message,
  type = "info",
  onConfirm,
  id,
}: Props) {
  return (
    <div>
      <p className="font-bold">{title}</p>
      <p>{message}</p>
      <button
        onClick={onConfirm}
        className={clsx([
          "font-medium",
          "px-4",
          "py-2",
          "rounded-lg",
          {
            "bg-red-400": type === "warning",
            "bg-gray-800": type === "info",
            "hover:bg-red-500": type === "warning",
            "hover:bg-gray-900": type === "info",
            "text-white": type === "info",
          },
        ])}
      >
        OK
      </button>
      {" | "}
      <button
        onClick={() => toast.dismiss(id)}
        className="font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Cancel
      </button>
    </div>
  );
}
