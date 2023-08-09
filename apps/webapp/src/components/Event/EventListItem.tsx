import { Event } from "@weekendr/src/gql/graphql";
import { format } from "date-fns";
import Image from "next/image";
import { FC, lazy, Suspense, useMemo, useState } from "react";
import { clsx } from "clsx";
import useCancelEvent from "@weekendr/src/hooks/useCancelEvent";
import useVenue from "@weekendr/src/hooks/useVenue";
import { toast } from "react-hot-toast";
import { renderCategory } from "@weekendr/src/utils/category";
import { useMediaQuery } from "usehooks-ts";
import { Spinner } from "@weekendr/src/components/Spinner";

interface Props {
  event: Event;
  fallbackPicture: string;
}

const Button = lazy(() => import("@weekendr/src/components/Form/Button"));
const Dialog = lazy(() => import("@weekendr/src/components/Dialog"));

const getDate = (date: number) => {
  return format(date, "dd.MM.yyyy HH:mm");
};

const EventListItem: FC<Props> = ({ event, fallbackPicture }: Props) => {
  const isPhone = useMediaQuery("(pointer: coarse)");
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const { cancelEvent, loading } = useCancelEvent();
  const { venue } = useVenue();
  const [isExpanded, setIsExpanded] = useState(false);

  const description = useMemo(() => {
    // TODO: Trim description if too long
    return (event.description ?? "N/A")
      .split(/\r|\n/)
      .map((line) => <p key={line}>{line}</p>);
  }, [event.description]);

  return (
    <div
      onMouseEnter={() => setIsExpanded((prev) => !prev)}
      onMouseLeave={() => setIsExpanded(false)}
      className="my-2"
    >
      <div
        className={clsx([
          "hover:cursor-pointer",
          "flex",
          "items-center",
          "justify-between",
          "p-4",
          "bg-gray-700",
          "select-none",
          "bg-gray-700",
        ])}
      >
        <div>{event.name}</div>
        <div>
          Starts: <strong>{getDate(event.startDate)}</strong>
        </div>
      </div>
      <div
        className={clsx(["max-h-0", "overflow-hidden", "bg-gray-600"], {
          "max-h-screen p-4": isExpanded || isPhone,
          flex: !isSmallScreen,
          "px-0": isSmallScreen,
        })}
      >
        <div className="w-1/2">{description}</div>
        <div className="w-1/2 ml-8 flex flex-col">
          <Image
            className="rounded"
            width={128}
            height={128}
            alt={event.name}
            src={event.picture || fallbackPicture}
          />
          <div>
            <span className="uppercase">entry fee</span>:{" "}
            <strong>{event.price === 0 ? "Free" : `€${event.price}`}</strong>
          </div>
          <div>
            Ends: <strong>{getDate(event.endDate)}</strong>
          </div>
          <div className="flex items-center">
            <span>Category: </span>
            {renderCategory(event.category)}
          </div>
          <Suspense fallback={<Spinner />}>
            {venue?.isOwnedByMe && (
              <Button
                disabled={loading}
                onClick={() =>
                  toast((t) => (
                    <Dialog
                      onConfirm={async () => {
                        await cancelEvent(Number(event.id));
                        toast.dismiss(t.id);
                      }}
                      title="Are you sure you want to proceed with canceling the event?"
                      message="Pressing OK will cancel the event"
                      type="warning"
                      id={t.id}
                    />
                  ))
                }
              >
                Cancel Event
              </Button>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default EventListItem;
