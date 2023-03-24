import Link from "next/link";
import { Venue } from "src/gql/graphql";
import { useState } from "react";
import Dialog from "../Dialog";
import { useRouter } from "next/router";
import useDeleteVenue from "@diplomski/hooks/useDeleteVenue";

interface Props {
  venue: Venue;
}

export default function VenueNavigation({ venue }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { deleteVenue } = useDeleteVenue();

  return (
    <>
      {venue.isOwnedByMe && (
        <>
          <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
          {" | "}
          <button onClick={() => setIsOpen(true)}>Delete</button>
          <Dialog
            onConfirm={async () => {
              await deleteVenue(Number(venue.id));
              router.push("/");
            }}
            title="Are you sure you want to proceed?"
            message="Pressing OK will PERMANENTLY delete the venue from the database."
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            type="warning"
          />
        </>
      )}
    </>
  );
}
