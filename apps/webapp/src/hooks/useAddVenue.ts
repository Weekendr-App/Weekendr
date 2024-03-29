import {
  CreateVenueInput,
  MutationCreateVenueArgs,
  Venue,
} from "@weekendr/src/gql/graphql";
import { pick } from "ramda";
import { gql, useMutation } from "urql";

const mutation = gql`
  mutation AddVenue($fields: CreateVenueInput!) {
    createVenue(fields: $fields) {
      id
    }
  }
`;

export default function useAddVenue() {
  const [result, execute] = useMutation<
    { createVenue: Venue },
    MutationCreateVenueArgs
  >(mutation);

  return {
    result,
    loading: result.fetching,
    addVenue: (fields: CreateVenueInput) =>
      execute({
        fields: pick(
          ["name", "address", "latitude", "longitude", "phone", "picture"],
          fields
        ),
      }),
  };
}
