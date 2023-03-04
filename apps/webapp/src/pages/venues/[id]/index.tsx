import { Spinner } from "@diplomski/components/Spinner";
import { Venue } from "@diplomski/gql/graphql";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { lazy, Suspense, useMemo } from "react";
import { gql, useQuery } from "urql";

const query = gql`
  query VenuePage($id: Float!) {
    venue(id: $id) {
      id
      name
      latitude
      longitude
      isOwnedByMe
      picture
      address
    }
  }
`;

const StaticMap = lazy(() => import("@diplomski/components/StaticMap"));
const VenueNavigation = lazy(
  () => import("@diplomski/components/Venue/VenueNavigation")
);

export default function VenuePage() {
  const router = useRouter();
  const { id } = router.query;
  const [{ data, fetching }] = useQuery<{ venue: Venue }>({
    query,
    variables: { id: Number(id) },
  });

  const venue = useMemo(() => data?.venue, [data]);

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
          </div>
          <div className="w-1/2">
            <Suspense fallback={<Spinner />}>
              <StaticMap
                height={500}
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
        <div className="flex flex-col text-white">TODO: Add venue events</div>
      </Suspense>
    </>
  );
}
