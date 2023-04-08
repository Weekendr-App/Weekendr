import VenueListItem from "@diplomski/components/Venue/VenueListItem";
import { Venue } from "@diplomski/gql/graphql";
import { useAuth } from "@diplomski/hooks/useAuth";
import Head from "next/head";
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
        <h1 className="text-6xl font-bold">Profile</h1>
        <hr className="my-3" />
        <div className="flex flex-col">
          <h2 className="text-4xl font-bold my-2">My venues</h2>
          <div className="flex flex-col">
            {data?.me.venues.map((venue: Venue) => (
              <VenueListItem key={venue.id} venue={venue} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
