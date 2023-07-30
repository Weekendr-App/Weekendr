import { Event, Venue, VenueStatus } from "@diplomski/gql/graphql";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  venue: Pick<Venue, "id" | "name" | "picture" | "address" | "status"> & {
    events?: Pick<Event, "id" | "category">[] | null;
  };
}

const VenueListItem: FC<Props> = ({ venue }) => {
  const router = useRouter();
  const isPhone = useMediaQuery("(pointer: coarse)");
  const isSmallScreen = useMediaQuery("(max-width: 640px)")

  const name = useMemo(() => {
    if (venue.status === VenueStatus.Draft) {
      return `${venue.name} (Draft)`;
    }

    return venue.name;
  }, [venue]);

  return (
    <div
      data-content={name}
      onClick={() =>
        venue.status === VenueStatus.Active &&
        router.push(`/venues/${venue.id}`)
      }
      className={clsx(
        [
          "card",
          "bg-white",
          "flex",
          "rounded-3xl",
          "justify-center",
          "relative",
          "mt-10",
        ],
        {
          grayscale: venue.status === VenueStatus.Draft,
          "w-40": isSmallScreen,
          "h-56": isSmallScreen,
          "w-48": !isSmallScreen,
          "h-64": !isSmallScreen,
        }
      )}
    >
      <div
        className={clsx(
          [
            "flex",
            "justify-center",
            "items-center",
            "rounded-3xl",
            "cursor-pointer",
            "z-10",
            "transform",
            "hover:-translate-y-8",
          ],
          { "-translate-y-8": isPhone, "rounded-b-none": isPhone }
        )}
        style={{
          backgroundImage: `url(${venue.picture})`,
        }}
      >
        <Image
          src={venue.picture}
          alt={name}
          width={isSmallScreen ? 160 : 192}
          height={isSmallScreen ? 224 : 256}
        />
      </div>
    </div>
  );
};

export default VenueListItem;
