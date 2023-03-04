import { Venue } from "@diplomski/gql/graphql";
import { useRouter } from "next/router";
import { gql, useQuery } from "urql";

const query = gql`
  query VenuePage($id: Float!) {
    venue(id: $id) {
      name
      picture
      address
      latitude
      longitude
      id
    }
  }
`;

export default function useVenue() {
  const router = useRouter();
  const { id } = router.query;
  const [{ data, fetching }] = useQuery<{ venue: Venue }>({
    query,
    variables: { id: Number(id) },
  });

  return {
    data,
    fetching,
  }
}
