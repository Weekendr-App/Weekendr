import VenueForm from "@diplomski/components/Form/VenueForm";
import { Spinner } from "@diplomski/components/Spinner";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense } from "react";

export default function AddVenuePage() {
  const { addVenue, result } = useAddVenue();
  const router = useRouter();

  if (result.data?.createVenue?.id) {
    router.push(`/venues/${result.data.createVenue.id}`);
  }

  return (
    <>
      <Head>
        <title>Add Venue</title>
      </Head>
      <Suspense fallback={<Spinner />}>
        <VenueForm
          title="Add Venue"
          onSubmit={async (e) => await addVenue(e)}
          buttonText="Add"
          initialValues={{
            name: "",
            picture: "",
            address: "",
            latitude: 0,
            longitude: 0,
          }}
        />
      </Suspense>
    </>
  );
}
