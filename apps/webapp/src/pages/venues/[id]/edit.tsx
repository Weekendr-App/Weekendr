import Head from "next/head";
import { lazy, Suspense, useCallback, useMemo } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useEditVenue from "@diplomski/hooks/useEditVenue";
import useVenue from "@diplomski/hooks/useVenue";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import { useRouter } from "next/router";

const VenueForm = lazy(() => import("@diplomski/components/Venue/VenueForm"));

export default function EditVenue() {
  const { data } = useVenue();
  const { updateVenue } = useEditVenue();
  const router = useRouter();

  const venue = useMemo(() => data?.venue, [data]);

  const onSubmit = useCallback(
    async (values: VenueFormValues) => {
      if (venue) {
        // TODO: Handle errors
        await updateVenue({
          ...values,
          id: Number(venue.id),
        });
        router.push(`/venues/${venue.id}`);
      }
    },
    [updateVenue, venue, router]
  );

  if (!venue) {
    return <Spinner />;
  }

  return (
    <>
      <Head>
        <title>Edit Venue</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <VenueForm
          title="Update Venue"
          initialValues={{
            name: venue.name,
            address: venue.address,
            latitude: venue.latitude,
            longitude: venue.longitude,
            picture: venue.picture,
          }}
          buttonText="Update"
          onSubmit={onSubmit}
        />
      </Suspense>
    </>
  );
}
