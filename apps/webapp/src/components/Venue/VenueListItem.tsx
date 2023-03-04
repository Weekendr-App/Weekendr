import { Venue } from "@diplomski/gql/graphql";
import { useMapHover } from "@diplomski/hooks/useMapHover";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC } from "react";

interface Props {
  venue: Venue;
}

const VenueListItem: FC<Props> = ({ venue }) => {
  const router = useRouter();

  const { setHighlightedVenueId, isHighlighted } = useMapHover();

  return (
    <div
      key={venue.id}
      className={clsx(
        [
          "flex",
          "border",
          "p-2",
          "rounded",
          "shadow",
          "gap-2",
          "cursor-pointer",
        ],
        {
          "bg-blue-900": isHighlighted(venue.id),
        }
      )}
      onClick={() => router.push(`/venues/${venue.id}`)}
      onMouseEnter={() => setHighlightedVenueId(venue.id)}
      onMouseLeave={() => setHighlightedVenueId(null)}
    >
      <Image
        className="rounded"
        alt={venue.name}
        src={venue.picture}
        width={100}
        height={100}
      />
      <div className="flex flex-col">
        <span className="font-bold">{venue.name}</span>
        <span>{venue.address}</span>
      </div>
    </div>
  );
};

export default VenueListItem;
