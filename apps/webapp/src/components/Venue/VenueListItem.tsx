import { Event, Venue, VenueStatus } from "@weekendr/src/gql/graphql";
import { clsxm } from "@weekendr/src/utils/clsxm";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  venue: Pick<Venue, "id" | "name" | "picture" | "address" | "status"> & {
    events?: Pick<Event, "id" | "category">[] | null;
  };
}

const VenueListItem: FC<Props> = ({ venue }) => {
  const router = useRouter();
  const isPhone = useMediaQuery("(pointer: coarse)");
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const id = `venue-image-${venue.id}`;

  const name = useMemo(() => {
    if (venue.status === VenueStatus.Draft) {
      return `${venue.name} (Draft)`;
    }

    return venue.name;
  }, [venue]);

  const nameRef = useCallback(
    (node: HTMLParagraphElement | null) => {
      if (node !== null) {
        document.styleSheets[0].insertRule(
          `#${id}${isPhone ? "" : ":hover"} {
            transform: translateY(-${node.clientHeight}px);
          }`,
          0
        );
      } else {
        document.styleSheets[0].deleteRule(0);
      }
    },
    [id, isPhone]
  );

  return (
    <div
      className={clsxm(
        ["mt-10", "relative", "hover:mt-14", "transition-all", "duration-500"],
        {
          grayscale: venue.status === VenueStatus.Draft,
          "w-36 h-48": isSmallScreen,
          "w-48 h-64": !isSmallScreen,
          "mt-14": isPhone,
        }
      )}
      onClick={() =>
        venue.status === VenueStatus.Active &&
        router.push(`/venues/${venue.id}`)
      }
    >
      <Image
        id={id}
        className={clsx(
          ["z-10", "cursor-pointer", "rounded-3xl", "transition-transform"],
          {
            "w-36 h-48": isSmallScreen,
            "w-48 h-64": !isSmallScreen,
            "rounded-b-none": isPhone,
          }
        )}
        src={venue.picture}
        alt={name}
        fill
      />
      <div
        className={clsx(["bg-white", "break-words", "rounded-3xl"], {
          "w-36 h-48": isSmallScreen,
          "w-48 h-64": !isSmallScreen,
        })}
      >
        <p
          ref={nameRef}
          className={clsx(
            [
              "tracking-widest",
              "absolute",
              "bottom-0",
              "py-1",
              "p-5",
              "font-bold",
              "text-gray-800",
              "text-sm",
            ],
            { "max-w-[192px]": !isSmallScreen, "max-w-[144px]": isSmallScreen }
          )}
        >
          {name}
        </p>
      </div>
    </div>
  );
};

export default VenueListItem;
