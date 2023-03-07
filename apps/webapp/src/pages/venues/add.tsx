import { Spinner } from "@diplomski/components/Spinner";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback } from "react";

const VenueForm = lazy(() => import("@diplomski/components/Venue/VenueForm"));

export default function AddVenuePage() {
  const { addVenue, result } = useAddVenue();
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: VenueFormValues) => {
      await addVenue(values);
    },
    [addVenue]
  );

  if (result.data?.createVenue?.id) {
    router.push(`/venues/${result.data.createVenue.id}`);
  }

  return (
    <>
      <Head>
        <title>Add Venue</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <VenueForm title="Add Venue" onSubmit={onSubmit} buttonText="Add" />
      </Suspense>
    </>
  );
}
