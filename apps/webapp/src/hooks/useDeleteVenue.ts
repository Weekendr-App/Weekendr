import { Venue } from "@diplomski/gql/graphql";
import { gql, useMutation } from "urql";

const DELETE_VENUE_MUTATION = gql(`
  mutation DeleteVenue($id: Float!) {
    deleteVenue(id: $id) {
      id
    } 
  }
`);

export default function useDeleteVenue() {
  const [result, execute] = useMutation<
    { deleteVenue: Venue },
    {
      id: number;
    }
  >(DELETE_VENUE_MUTATION);

  return {
    loading: result.fetching,
    deleteVenue: (id: number) => execute({ id }),
  };
}
