import Link from "next/link";
import { Venue } from "src/gql/graphql";
import { useRouter } from "next/router";
import useDeleteVenue from "@weekendr/src/hooks/useDeleteVenue";
import { toast } from "react-hot-toast";
import { Spinner } from "@weekendr/src/components/Spinner";
import { lazy, Suspense } from "react";

interface Props {
  venue: Venue;
}

const Dialog = lazy(() => import("@weekendr/src/components/Dialog"));

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
                <Suspense fallback={<Spinner />}>
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
                </Suspense>
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
