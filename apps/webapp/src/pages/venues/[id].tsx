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
      isOwnedByMe
      picture
      address
    }
  }
`;

const Header = lazy(() => import("@diplomski/components/Header"));

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
        <Header />
        <div className="flex text-white">
          <div className="p-3 w-1/2">
            <h1 className="text-4xl font-bold">
              {venue.name}
              {/* TODO: Add edit/delete buttons for venue owner */}
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
              unoptimized
            />
          </div>
          <div className="p-3 w-1/2">TODO: Add map with venue location</div>
        </div>
        <div className="flex flex-col text-white">TODO: Add venue events</div>
      </Suspense>
    </>
  );
}
