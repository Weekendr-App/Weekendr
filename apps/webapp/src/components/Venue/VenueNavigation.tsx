import { useRouter } from "next/router";
import Link from "next/link";
import { Venue } from "src/gql/graphql";
import useDeleteVenue from "@diplomski/hooks/useDeleteVenue";

interface Props {
  venue: Venue;
}

export default function VenueNavigation({ venue }: Props) {
  const router = useRouter();
  const { loading, deleteVenue } = useDeleteVenue();

  return (
    <>
      {venue.isOwnedByMe && (
        <>
          <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure?")) {
                await deleteVenue(Number(venue.id));
                router.push("/");
              }
            }}
          >
            Delete
          </button>
        </>
      )}
    </>
  );
}
