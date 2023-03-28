import { gql, useMutation } from "urql";
import { UpdateVenueInput, Venue } from "@diplomski/gql/graphql";
import { pick } from "ramda";

const EDIT_VENUE_MUTATION = gql`
  mutation EditVenue($fields: UpdateVenueInput!) {
    updateVenue(fields: $fields) {
      id
    }
  }
`;

export default function useEditVenue() {
  const [result, execute] = useMutation<
    { updateVenue: Venue },
    { fields: UpdateVenueInput }
  >(EDIT_VENUE_MUTATION);

  return {
    result,
    loading: result.fetching,
    updateVenue: (fields: UpdateVenueInput) =>
      execute({
        fields: pick(
          [
            "id",
            "name",
            "address",
            "latitude",
            "longitude",
            "phone",
            "picture",
          ],
          fields
        ),
      }),
  };
}
