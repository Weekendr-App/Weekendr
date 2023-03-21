import Head from "next/head";
import { lazy, Suspense, useCallback } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useEditVenue from "@diplomski/hooks/useEditVenue";
import useVenue from "@diplomski/hooks/useVenue";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import { useRouter } from "next/router";

const VenueForm = lazy(() => import("@diplomski/components/Venue/VenueForm"));

export default function EditVenue() {
  const { venue, fetching } = useVenue();
  const { updateVenue } = useEditVenue();
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: VenueFormValues) => {
      if (venue) {
        const result = await updateVenue({
          ...values,
          id: Number(venue.id),
        });
        if(!result.error) {
          router.push(`/venues/${venue.id}`);
        }
      }
    },
    [updateVenue, venue, router]
  );

  if (!venue || fetching) {
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
            phone: venue.phone
          }}
          buttonText="Update"
          onSubmit={onSubmit}
        />
      </Suspense>
    </>
  );
}
