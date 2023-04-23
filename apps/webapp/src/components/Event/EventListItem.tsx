import { Event } from "@diplomski/gql/graphql";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { clsx } from "clsx";
import Button from "../Form/Button";
import useCancelEvent from "@diplomski/hooks/useCancelEvent";
import useVenue from "@diplomski/hooks/useVenue";
import Dialog from "../Dialog";
import { toast } from "react-hot-toast";

interface Props {
  event: Event;
  fallbackPicture: string;
}

const getDate = (date: number) => {
  return format(date, "dd.MM.yyyy HH:mm");
};

const EventListItem: FC<Props> = ({ event, fallbackPicture }: Props) => {
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
    <div className="my-2">
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className={clsx([
          "hover:cursor-pointer",
          "flex",
          "items-center",
          "justify-between",
          "p-4",
          "bg-gray-700",
          "select-none",
        ])}
      >
        <div>{event.name}</div>
        <div>
          Starts: <strong>{getDate(event.startDate)}</strong>
        </div>
      </div>
      <div
        className={clsx(
          ["max-h-0", "overflow-hidden", "bg-gray-50", "flex", "bg-gray-600"],
          {
            "max-h-screen p-4": isExpanded,
          }
        )}
      >
        <div className="w-full">{description}</div>
        <div className="w-1/3 ml-8 flex flex-col">
          <Image
            className="rounded"
            width={128}
            height={128}
            alt={event.name}
            src={event.picture ?? fallbackPicture}
          />
          <div>
            <span className="uppercase">entry fee</span>:{" "}
            <strong>{event.price === 0 ? "Free" : `€${event.price}`}</strong>
          </div>
          <div>
            Ends: <strong>{getDate(event.endDate)}</strong>
          </div>
          <div>
            Category: <strong>{event.category.name}</strong>
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default EventListItem;
