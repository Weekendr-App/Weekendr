import { Event, Venue, VenueStatus } from "@diplomski/gql/graphql";
import { useMapHover } from "@diplomski/hooks/useMapHover";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import { useDarkMode } from "usehooks-ts";

interface Props {
  venue: Pick<Venue, "id" | "name" | "picture" | "address" | "status"> & {
    events?: Pick<Event, "id" | "category">[] | null;
  };
}

const VenueListItem: FC<Props> = ({ venue }) => {
  const router = useRouter();

  const { setHighlightedVenueId, isHighlighted } = useMapHover();
  const { isDarkMode } = useDarkMode();

  const name = useMemo(() => {
    if (venue.status === VenueStatus.Draft) {
      return `${venue.name} (Draft)`;
    }

    return venue.name;
  }, [venue]);

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
          "items-center",
        ],
        {
          "bg-amber-100": isHighlighted(venue.id) && !isDarkMode,
          "bg-blue-900": isHighlighted(venue.id) && isDarkMode,
          grayscale: venue.status === VenueStatus.Draft,
        }
      )}
      onClick={() => {
        venue.status === VenueStatus.Active &&
          router.push(`/venues/${venue.id}`);
      }}
      onMouseEnter={() => setHighlightedVenueId(venue.id)}
      onMouseLeave={() => setHighlightedVenueId(null)}
    >
      <Image
        className="rounded aspect-video"
        alt={venue.name}
        src={venue.picture}
        width={100}
        height={100}
      />
      <div className="flex flex-col dark:text-white">
        <span className="font-bold">{name}</span>
        <span>{venue.address}</span>
        {venue.events && venue.events.length > 0
          ? venue.events.map((e) => (
              <span key={e.id}>
                <strong>Next event we&apos;ll be playing: </strong>
                {e.category.name}{" "}
                <Image
                  src={e.category.icon || ""}
                  width={32}
                  height={32}
                  alt={e.category.name}
                  style={{ display: "inline" }}
                />
              </span>
            ))
          : "No events scheduled"}
      </div>
    </div>
  );
};

export default VenueListItem;
