import Head from "next/head";
import { lazy, Suspense, useCallback, useState } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useVenue from "@diplomski/hooks/useVenue";

const Map = lazy(() => import("@diplomski/components/Map"));
const VenueListItem = lazy(
  () => import("@diplomski/components/Venue/VenueListItem")
);

export default function Home() {
  const [cardId, setCardId] = useState<string | undefined>();
  const { venue } = useVenue(cardId);

  const toggleCard = useCallback(
    (id: string) => {
      if (cardId === id) {
        setCardId(undefined);
      } else {
        setCardId(id);
      }
    },
    [cardId]
  );

  return (
    <>
      <Head>
        <title>Weekendr</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <>
          <Map setCardId={toggleCard} />
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2">
            {venue && <VenueListItem venue={venue} isShown={!!cardId} />}
          </div>
        </>
      </Suspense>
    </>
  );
}
