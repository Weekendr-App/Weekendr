import { Spinner } from "@diplomski/components/Spinner";
import useVenue from "@diplomski/hooks/useVenue";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { lazy, Suspense } from "react";

const StaticMap = lazy(() => import("@diplomski/components/StaticMap"));
const VenueNavigation = lazy(
  () => import("@diplomski/components/Venue/VenueNavigation")
);
const Button = lazy(() => import("@diplomski/components/Form/Button"));
const EventListItem = lazy(
  () => import("@diplomski/components/Event/EventListItem")
);

export default function VenuePage() {
  const { venue, fetching } = useVenue();
  const router = useRouter();

  if (!venue || fetching) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{venue.name}</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <div className="flex text-white">
          <div className="p-3 w-1/2">
            <VenueNavigation venue={venue} />
            <h1 className="text-4xl font-bold">
              {venue.name}
              {venue.isOwnedByMe && (
                <span className="text-xl"> (Your venue)</span>
              )}
            </h1>
            <span className="text-xl">{venue.address}</span>
            <Image
              className="rounded"
              src={venue.picture}
              alt={venue.name}
              width={500}
              height={500}
            />
            <div
              className="flex flex-col text-white my-3 overflow-y-auto"
              style={{
                height: "calc(100vh - 64px - 560px)",
              }}
            >
              {venue.events?.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  fallbackPicture={venue.picture}
                />
              ))}
            </div>
            <Button
              type="button"
              onClick={() => router.push(`/venues/${venue.id}/events/add`)}
            >
              Add event to this venue
            </Button>
          </div>
          <div className="w-1/2">
            <Suspense fallback={<Spinner />}>
              <StaticMap
                height={"calc(100vh - 64px)"}
                viewport={{
                  latitude: venue.latitude,
                  longitude: venue.longitude,
                  zoom: 15,
                  bearing: 0,
                  pitch: 30,
                  padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                  },
                }}
                venues={[venue]}
              />
            </Suspense>
          </div>
        </div>
      </Suspense>
    </>
  );
}
