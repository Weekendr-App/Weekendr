import Link from "next/link";
import { Venue } from "src/gql/graphql";
import { useState } from "react";
import Dialog from "../Dialog";

interface Props {
  venue: Venue;
}

export default function VenueNavigation({ venue }: Props) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      {venue.isOwnedByMe && (
        <>
          <Link href={`/venues/${venue.id}/edit`}>Edit</Link>
          {" | "}
          <button onClick={() => setOpenDialog(true)}>Delete</button>
          <Dialog
            title="Are you sure you want to proceed?"
            description="Pressing OK will PERMANENTLY delete the venue from the database."
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            id={venue.id}
            type="warning"
          />
        </>
      )}
    </>
  );
}
