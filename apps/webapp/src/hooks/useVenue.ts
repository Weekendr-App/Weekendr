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
      phone
    }
  }
`;

export default function useVenue() {
  const router = useRouter();
  const { id } = router.query;
  const [{ data, fetching }] = useQuery<{ venue: Venue }>({
    query,
    pause: isNaN(Number(id)),
    variables: { id: Number(id) },
  });

  const venue = useMemo(() => data?.venue, [data]);

  return {
    venue,
    fetching,
  };
}
