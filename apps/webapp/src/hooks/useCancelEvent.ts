import { Event, MutationCancelEventArgs } from "@diplomski/gql/graphql";
import { gql, useMutation } from "urql";

const CANCEL_EVENT_MUTATION = gql`
  mutation CancelEvent($eventId: Float!) {
    cancelEvent(eventId: $eventId) {
      venue {
        id
      }
    }
  }
`;

export default function useCancelEvent() {
  const [result, execute] = useMutation<
    { cancelEvent: Event },
    MutationCancelEventArgs
  >(CANCEL_EVENT_MUTATION);

  return {
    loading: result.fetching,
    cancelEvent: (eventId: number) => execute({ eventId }),
  };
}
