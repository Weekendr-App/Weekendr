import Head from "next/head";
import { lazy, Suspense, useState } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useVenue from "@diplomski/hooks/useVenue";

const Map = lazy(() => import("@diplomski/components/Map"));
const VenueListItem = lazy(
  () => import("@diplomski/components/Venue/VenueListItem")
);

export default function Home() {
  const [cardId, setCardId] = useState<string | undefined>();
  const { venue } = useVenue(cardId);

  return (
    <>
      <Head>
        <title>Weekendr</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <>
          <Map setCardId={setCardId} />
          <div
            className="fixed bottom-10 left-1/2"
            style={{ transform: "translateX(-50%)" }}
          >
            {venue && <VenueListItem venue={venue} />}
          </div>
        </>
      </Suspense>
    </>
  );
}
