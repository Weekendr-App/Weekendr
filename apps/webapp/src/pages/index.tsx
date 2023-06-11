import Head from "next/head";
import { lazy, Suspense, useState } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import { useMediaQuery } from "usehooks-ts";
import useCategories from "@diplomski/hooks/useCategories";
import { VenuesInRangeQuery } from "@diplomski/gql/graphql";

const Map = lazy(() => import("@diplomski/components/Map"));
const VenueListItem = lazy(
  () => import("@diplomski/components/Venue/VenueListItem")
);
const Select = lazy(() => import("@diplomski/components/Form/Select"));

export default function Home() {
  const isPhone = useMediaQuery("(max-width: 640px)");
  const [visibleVenues, setVisibleVenues] = useState<
    VenuesInRangeQuery["venuesInRange"]
  >([]);
  const [categoryId, setCategoryId] = useState(0);
  const { categories } = useCategories();

  return (
    <>
      <Head>
        <title>Weekendr</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <div className="sm:flex">
          <div
            className="sm:w-1/2 w-full p-2 overflow-y-auto"
            style={{ height: isPhone ? "calc((100vh / 2) - 32px)" : "auto" }}
          >
            <Select
              value={categoryId}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(categoryId) => setCategoryId(categoryId)}
              placeholder="Filter by category"
            />
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-2">
                Venues currently visible on map
              </h2>
              <div className="flex flex-col gap-2">
                {visibleVenues.length > 0 ? (
                  visibleVenues.map((venue) => (
                    <VenueListItem key={venue.id} venue={venue} />
                  ))
                ) : (
                  <span className="text-gray-500">No venues visible</span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/2">
            <Map
              categoryId={categoryId}
              onChangeVisibleVenues={setVisibleVenues}
            />
          </div>
        </div>
      </Suspense>
    </>
  );
}
