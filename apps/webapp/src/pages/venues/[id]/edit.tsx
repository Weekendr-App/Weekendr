import Head from "next/head";
import { Suspense } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useEditVenue from "@diplomski/hooks/useEditVenue";
import useVenue from "@diplomski/hooks/useVenue";
import VenueForm from "@diplomski/components/Form/VenueForm";

export default function EditVenue() {
  const { data } = useVenue();
  const { updateVenue } = useEditVenue();

  return (
    <>
      <Head>
        <title>Edit Venue</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <VenueForm
          title="Update Venue"
          initialValues={{
            id: Number(data?.venue.id) || 0,
            name: data?.venue.name || "",
            address: data?.venue.address || "",
            picture: data?.venue.picture || "",
            latitude: data?.venue.latitude || 0,
            longitude: data?.venue.longitude || 0,
          }}
          defaultValue={data?.venue.address}
          venue={data?.venue}
          buttonText="Update"
          onSubmit={async (e) => await updateVenue(e)}
        />
      </Suspense>
    </>
  );
}
