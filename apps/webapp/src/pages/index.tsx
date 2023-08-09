import Head from "next/head";
import { lazy, Suspense, useMemo, useState } from "react";
import { Spinner } from "@weekendr/src/components/Spinner";
import useVenue from "@weekendr/src/hooks/useVenue";
import { clsxm } from "@weekendr/src/utils/clsxm";
import { useDebounce } from "usehooks-ts";

const Map = lazy(() => import("@weekendr/src/components/Map"));
const VenueListItem = lazy(
  () => import("@weekendr/src/components/Venue/VenueListItem")
);

export default function Home() {
  const [cardId, setCardId] = useState<string | undefined>();
  const { venue, fetching } = useVenue(cardId);

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
          <Map setCardId={setCardId} />
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
