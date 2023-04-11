import {
  CreateEventInput,
  Event,
  MutationCreateEventArgs,
} from "@diplomski/gql/graphql";
import { gql, useMutation } from "urql";

const mutation = gql`
  mutation AddEvent($fields: CreateEventInput!) {
    createEvent(fields: $fields) {
      id
    }
  }
`;

export default function useAddEvent() {
  const [result, execute] = useMutation<
    { createEvent: Event },
    MutationCreateEventArgs
  >(mutation);

  return {
    result,
    loading: result.fetching,
    addEvent: (fields: CreateEventInput) => execute({ fields }),
  };
}
