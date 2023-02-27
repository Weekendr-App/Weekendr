import { CreateVenueInput, Venue } from "@diplomski/gql/graphql";
import { gql, useMutation } from "urql";

const mutation = gql(`
  mutation AddVenue($fields: CreateVenueInput!) {
    createVenue(fields: $fields) {
      id
    }
  }
`);

export default function useAddVenue() {
  const [result, execute] = useMutation<
    { createVenue: Venue },
    { fields: CreateVenueInput }
  >(mutation);

  return {
    result,
    loading: result.fetching,
    addVenue: (fields: CreateVenueInput) => execute({ fields }),
  };
}
