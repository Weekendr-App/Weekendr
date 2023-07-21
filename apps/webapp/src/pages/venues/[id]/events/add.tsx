import EventForm, {
  EventFormValues,
} from "@diplomski/components/Event/EventForm";
import useAddEvent from "@diplomski/hooks/useAddEvent";
import useVenue from "@diplomski/hooks/useVenue";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback } from "react";

export default function AddEventPage() {
  const { addEvent, result } = useAddEvent();
  const { venue } = useVenue();
  const router = useRouter();
  const { id } = router.query;

  if (venue?.isOwnedByMe === false) {
    router.push("/");
  }

  const onSubmit = useCallback(
    async (values: EventFormValues) => {
      await addEvent({
        ...values,
        venueId: Number(id),
      });
    },
    [addEvent, id]
  );

  if (result.data?.createEvent.id) {
    router.push(`/venues/${id}`);
  }

  return (
    <>
      <Head>
        <title>Add an event</title>
      </Head>
      <div style={{ height: "calc(100vh - 64px)" }}>
        <div className="h-full bg-gray-900 pt-10">
          <EventForm
            title="Add an event"
            buttonText="Add"
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </>
  );
}
