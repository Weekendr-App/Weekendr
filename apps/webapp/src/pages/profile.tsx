import { Spinner } from "@diplomski/components/Spinner";
import { Role, Venue } from "@diplomski/gql/graphql";
import { useAuth } from "@diplomski/hooks/useAuth";
import Head from "next/head";
import Link from "next/link";
import { lazy, Suspense } from "react";
import { gql, useQuery } from "urql";

const query = gql`
  query Profile {
    me {
      id
      role
      venues {
        id
        name
        picture
        address
        status
      }
    }
  }
`;

const Button = lazy(() => import("@diplomski/components/Form/Button"));
const VenueListItem = lazy(
  () => import("@diplomski/components/Venue/VenueListItem")
);

export default function Profile() {
  const { user } = useAuth();
  const [{ data }] = useQuery({ query, pause: !user });

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div className="flex flex-col text-white p-3">
        <h1 className="text-4xl font-bold">Profile</h1>
        <hr className="my-3" />
        <div className="flex flex-col">
          <Suspense fallback={<Spinner />}>
            {data?.me.role === Role.Owner && (
              <>
                <h2 className="text-2xl font-bold my-2">My venues</h2>
                <div className="flex flex-col">
                  {data?.me.venues.length > 0 ? (
                    data?.me.venues.map((venue: Venue) => (
                      <VenueListItem key={venue.id} venue={venue} />
                    ))
                  ) : (
                    <p>You don&apos;t have any venues yet.</p>
                  )}
                </div>
                <Link href="/venues/add" className="my-2">
                  <Button>Add venue</Button>
                </Link>
              </>
            )}
          </Suspense>
        </div>
      </div>
    </>
  );
}
