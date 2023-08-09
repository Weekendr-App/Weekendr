import { EventFormValues } from "@weekendr/src/components/Event/EventForm";
import useAddEvent from "@weekendr/src/hooks/useAddEvent";
import useVenue from "@weekendr/src/hooks/useVenue";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback } from "react";
import { Spinner } from "@weekendr/src/components/Spinner";

const EventForm = lazy(
  () => import("@weekendr/src/components/Event/EventForm")
);

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
          <Suspense fallback={<Spinner />}>
            <EventForm
              title="Add an event"
              buttonText="Add"
              onSubmit={onSubmit}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
