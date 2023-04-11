import { gql, useMutation } from "urql";

const PUBLISH_VENUE_MUTATION = gql`
  mutation PublishVenue($id: Float!) {
    publishVenue(id: $id) {
      id
    }
  }
`;

export default function usePublishVenue() {
  const [result, executeMutation] = useMutation<
    { publishVenue: { id: number } },
    { id: number }
  >(PUBLISH_VENUE_MUTATION);

  return {
    result,
    loading: result.fetching,
    publishVenue: (id: number) => executeMutation({ id }),
  };
}
