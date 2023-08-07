import { Event, Venue, VenueStatus } from "@diplomski/gql/graphql";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const name = useMemo(() => {
    if (venue.status === VenueStatus.Draft) {
      return `${venue.name} (Draft)`;
    }

    return venue.name;
  }, [venue]);

  const frontRef = useRef<HTMLImageElement | null>(null);
  const backTextRef = useRef<HTMLParagraphElement | null>(null);
  const [backTextHeight, setBackTextHeight] = useState<number | null>(null);

  const onHover = useCallback(() => {
    if (frontRef.current) {
      frontRef.current.style.transform = `translateY(-${backTextHeight}px)`;
    }
  }, [backTextHeight]);
  const onLeave = useCallback(() => {
    if (frontRef.current) {
      frontRef.current.style.transform = `translateY(0)`;
    }
  }, []);

  // we use venue inside the dependency array because otherwise this useEffect won't run after we click or tap on a Marker on the map
  useEffect(() => {
    if (backTextRef.current) {
      setBackTextHeight(backTextRef.current.offsetHeight);
    }
  }, [venue]);

  // on mobile devices we don't want to have to tap & hold the screen to trigger onMouseEnter so we just run that code automatically if the user is on a mobile device
  useEffect(() => {
    isPhone && onHover();
  }, [onHover, isPhone]);

  return (
    <div
      className={clsx(["mt-10", "relative"], {
        grayscale: venue.status === VenueStatus.Draft,
        "w-36 h-48": isSmallScreen,
        "w-48 h-64": !isSmallScreen,
      })}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={() =>
        venue.status === VenueStatus.Active &&
        router.push(`/venues/${venue.id}`)
      }
    >
      <Image
        className={clsx(
          ["z-10", "cursor-pointer", "rounded-3xl", "transition-transform"],
          {
            "w-36 h-48": isSmallScreen,
            "w-48 h-64": !isSmallScreen,
            "rounded-b-none": isPhone,
          }
        )}
        ref={frontRef}
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
          ref={backTextRef}
          className={clsx(
            [
              "tracking-widest",
              "absolute",
              "bottom-0",
              "py-1",
              "p-5",
              "font-bold",
              "text-gray-800",
            ],
            { "max-w-[192px]": !isSmallScreen, "max-w-[144px]": isSmallScreen }
          )}
          style={{ fontSize: "0.8em" }}
        >
          {name}
        </p>
      </div>
    </div>
  );
};

export default VenueListItem;
