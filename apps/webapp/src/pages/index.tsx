import Head from "next/head";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useVenue from "@diplomski/hooks/useVenue";
import { clsxm } from "@diplomski/utils/clsxm";
import { useDebounce } from "usehooks-ts";

const Map = lazy(() => import("@diplomski/components/Map"));
const VenueListItem = lazy(
  () => import("@diplomski/components/Venue/VenueListItem")
);

export default function Home() {
  const [cardId, setCardId] = useState<string | undefined>();
  const { venue, fetching } = useVenue(cardId);

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

  const cardVenue = useDebounce(venue, 500);

  const shouldHideCard = useMemo(() => {
    if (fetching || !cardId) {
      return true;
    }

    if (!cardVenue) {
      return true;
    }

    return cardVenue.id !== cardId;
  }, [fetching, cardId, cardVenue]);

  return (
    <>
      <Head>
        <title>Weekendr</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <>
          <Map setCardId={toggleCard} />
          <div
            className={clsxm(
              [
                "fixed",
                "bottom-10",
                "left-1/2",
                "-translate-x-1/2",
                "opacity-1",
                "transition-opacity",
                "duration-500",
              ],
              {
                "opacity-0": shouldHideCard,
              }
            )}
          >
            {cardVenue && <VenueListItem venue={cardVenue} />}
          </div>
        </>
      </Suspense>
    </>
  );
}
