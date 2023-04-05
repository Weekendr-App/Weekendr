import Link from "next/link";
import { Venue } from "src/gql/graphql";
import Dialog from "../Dialog";
import { useRouter } from "next/router";
import useDeleteVenue from "@diplomski/hooks/useDeleteVenue";
import { toast } from "react-hot-toast";

interface Props {
  venue: Venue;
}

export default function VenueNavigation({ venue }: Props) {
  const router = useRouter();
  const { deleteVenue } = useDeleteVenue();

  return (
    <>
      {venue.isOwnedByMe && (
        <>
          <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
          {" | "}
          <button
            onClick={() =>
              toast((t) => (
                <Dialog
                  onConfirm={async () => {
                    await deleteVenue(Number(venue.id));
                    toast.dismiss(t.id);
                    router.push("/");
                  }}
                  title="Are you sure you want to proceed?"
                  message="Pressing OK will PERMANENTLY delete the venue from the database."
                  type="warning"
                  id={t.id}
                />
              ))
            }
          >
            Delete
          </button>
        </>
      )}
    </>
  );
}
