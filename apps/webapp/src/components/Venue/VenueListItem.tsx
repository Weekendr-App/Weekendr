import { Venue } from "@diplomski/gql/graphql";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  venue: Venue;
  setHighlightedId: (id: string | null) => void
}

const VenueListItem: FC<Props> = ({ venue, setHighlightedId }) => {
  const router = useRouter();

  return (
    <div
      key={venue.id}
      className="flex border p-2 rounded shadow gap-2 hover:bg-blue-900 cursor-pointer"
      onClick={() => router.push(`/venues/${venue.id}`)}
      onMouseEnter={() => setHighlightedId(venue.id)}
      onMouseLeave={() => setHighlightedId(null)}
    >
      <Image
        className="rounded"
        alt={venue.name}
        src={venue.picture}
        width={100}
        height={100}
        unoptimized
      />
      <div className="flex flex-col">
        <span className="font-bold">{venue.name}</span>
        <span>{venue.address}</span>
      </div>
    </div>
  );
};

export default VenueListItem;
