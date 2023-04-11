import { Venue } from "@diplomski/gql/graphql";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { gql, useQuery } from "urql";

const query = gql`
  query VenuePage($id: Float!) {
    venue(id: $id) {
      id
      name
      picture
      address
      latitude
      longitude
      isOwnedByMe
      events {
        id
        name
        description
        picture
        startDate
        endDate
        price
      }
      phone
      status
    }
  }
`;

export default function useVenue() {
  const router = useRouter();
  const { id } = router.query;
  const [{ data, fetching, error }] = useQuery<
    { venue: Venue },
    { id: number }
  >({
    query,
    pause: isNaN(Number(id)),
    variables: { id: Number(id) },
  });

  const venue = useMemo(() => data?.venue, [data]);

  return {
    venue,
    fetching,
    error,
  };
}
