import { Spinner } from "@diplomski/components/Spinner";
import {
  DraftVenuesQuery,
  ProfileMeQuery,
  Role,
  VenueStatus,
} from "@diplomski/gql/graphql";
import { useAuth } from "@diplomski/hooks/useAuth";
import Head from "next/head";
import Link from "next/link";
import { lazy, Suspense, useMemo } from "react";
import { gql, useQuery } from "urql";
import { toast } from "react-hot-toast";
import Dialog from "@diplomski/components/Dialog";
import usePublishVenue from "@diplomski/hooks/usePublishVenue";

const query = gql`
  query ProfileMe {
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

const draftVenues = gql`
  query DraftVenues {
    draftVenues {
      id
      name
      picture
      address
      status
      latitude
      longitude
      phone
    }
  }
`;

const Button = lazy(() => import("@diplomski/components/Form/Button"));
const VenueListItem = lazy(
  () => import("@diplomski/components/Venue/VenueListItem")
);

export default function Profile() {
  /* TODO: Fix layout on mobile */
  const { user } = useAuth();
  const [{ data }] = useQuery<ProfileMeQuery>({ query, pause: !user });
  const [{ data: draftVenueData }] = useQuery<DraftVenuesQuery>({
    query: draftVenues,
    pause: !user || data?.me.role !== Role.Moderator,
  });
  const { publishVenue, loading } = usePublishVenue();

  const profileSection = useMemo(() => {
    if (!user || !data?.me) {
      return <Spinner />;
    }

    const { role } = data.me;

    if (role === Role.Owner) {
      return (
        <>
          <h2 className="text-2xl font-bold">My venues</h2>
          <div className="grid justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data.me.venues.length > 0 ? (
              data.me.venues.map((venue) => (
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
      );
    }

    if (role === Role.Moderator && draftVenueData) {
      const { draftVenues } = draftVenueData;
      return (
        <>
          <h2 className="text-2xl font-bold my-2 text-white">Draft venues</h2>
          {draftVenues.length > 0 ? (
            draftVenues.map((venue) => (
              <div className="mb-10" key={venue.id}>
                <VenueListItem venue={venue} />
                <Button
                  disabled={loading}
                  onClick={async () => {
                    toast((t) => (
                      <Dialog
                        onConfirm={async () => {
                          toast.dismiss(t.id);
                          try {
                            await publishVenue(Number(venue.id));
                            toast((t) => (
                              <div>
                                <p>Successfully published venue</p>
                                <Button onClick={() => toast.dismiss(t.id)}>
                                  OK
                                </Button>
                              </div>
                            ));
                          } catch {
                            // Error is handled in urql client
                          }
                        }}
                        title="Are you sure you want to proceed?"
                        message="Pressing OK will update the venue status to ACTIVE"
                        id={t.id}
                      />
                    ));
                  }}
                  hidden={venue.status === VenueStatus.Active}
                >
                  {loading ? <Spinner /> : "Publish"}
                </Button>
              </div>
            ))
          ) : (
            <p>No draft venues</p>
          )}
        </>
      );
    }

    return null;
  }, [data?.me, user, draftVenueData, publishVenue, loading]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <div style={{ height: "calc(100vh - 64px)" }}>
        <div className={`flex flex-col p-3 text-white bg-gray-900 h-full`}>
          <h1 className="text-4xl font-bold ">Profile</h1>
          <hr className="my-3" />
          <div className="flex flex-col">
            <Suspense fallback={<Spinner />}>{profileSection}</Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
