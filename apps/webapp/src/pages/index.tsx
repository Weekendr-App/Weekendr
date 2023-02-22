import Head from "next/head";
import { useQuery } from "urql";
import { graphql } from "@diplomski/gql";
import { AllVenuesQueryQuery } from "@diplomski/gql/graphql";
import { lazy, Suspense } from "react";
import clsx from "clsx";

const Header = lazy(() => import("@diplomski/components/Header"));
const Venue = lazy(() => import("@diplomski/components/Venue"));

const VenuesQuery = graphql(`
  query allVenuesQuery {
    venues {
      id
      name
      createdAt
      updatedAt
    }
  }
`);

export default function Home() {
  const [{ data }] = useQuery<AllVenuesQueryQuery>({
    query: VenuesQuery,
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Suspense>
        <Header />
      </Suspense>
      <Suspense>
        <div className={clsx(["p-4", "flex", "gap-1"])}>
          {data?.venues.map((venue) => (
            <Venue key={venue.id} venue={venue} />
          ))}
        </div>
      </Suspense>
    </>
  );
}
