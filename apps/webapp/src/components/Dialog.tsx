import clsx from "clsx";

interface Props {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  title: string;
  message: string;
  type?: "warning" | "info";
  onConfirm: () => Promise<void>;
}

export default function Dialog({
  setOpenDialog,
  openDialog,
  title,
  message,
  type = "info",
  onConfirm
}: Props) {
  return (
    <dialog
      className="border-gray-800 border-2 rounded-xl z-10 p-5"
      open={openDialog}
    >
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
        onClick={() => setOpenDialog(false)}
        className="font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Cancel
      </button>
    </dialog>
  );
}
