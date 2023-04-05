import { Event } from "@diplomski/gql/graphql";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import { FC, useMemo } from "react";

interface Props {
  event: Event;
  fallbackPicture: string;
}

const getDate = (date: number) => {
  return format(date, "dd.MM.yyyy HH:mm");
};

const EventListItem: FC<Props> = ({ event, fallbackPicture }: Props) => {
  const router = useRouter();

  console.log(event.description);

  const description = useMemo(() => {
    // TODO: Trim description if too long
    return (event.description ?? "N/A").split(/\r|\n/).map((line) => (
      <p className="text-lg text-white" key={line}>
        {line}
      </p>
    ));
  }, [event.description]);

  return (
    <div
      key={event.id}
      className="bg-gray-700 p-3 rounded cursor-pointer my-2 flex gap-3"
      onClick={() => router.push(`/events/${event.id}`)}
    >
      <div>
        <h2 className="text-2xl font-bold text-white">{event.name}</h2>
        <div className="flex gap-1 text-white text-sm">
          <span>{getDate(event.startDate)}</span>
          <span> - </span>
          <span>{getDate(event.endDate)}</span>
        </div>
        <Image
          className="rounded"
          width={128}
          height={128}
          alt={event.name}
          src={event.picture ?? fallbackPicture}
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">Description:</h3>
        {description}
      </div>
    </div>
  );
};

export default EventListItem;
