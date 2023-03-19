import useDeleteVenue from "@diplomski/hooks/useDeleteVenue";
import clsx from "clsx";
import { useRouter } from "next/router";

interface Props {
  openDialog: boolean;
  setOpenDialog: (value: boolean) => void;
  id: string;
  title: string;
  description: string;
  type?: "warning" | "info";
}

export default function Dialog({
  setOpenDialog,
  openDialog,
  id,
  title,
  description,
  type = "info",
}: Props) {
  const router = useRouter();
  const { deleteVenue } = useDeleteVenue();

  return (
    <dialog
      className="border-gray-800 border-2 rounded-xl z-10 p-5"
      open={openDialog}
    >
      <p className="font-bold">{title}</p>
      <p>{description}</p>
      <button
        onClick={async () => {
          await deleteVenue(Number(id));
          router.push("/");
        }}
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
