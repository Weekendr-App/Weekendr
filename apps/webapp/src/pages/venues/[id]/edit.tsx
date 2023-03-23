import Head from "next/head";
import { lazy, Suspense, useCallback } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useEditVenue from "@diplomski/hooks/useEditVenue";
import useVenue from "@diplomski/hooks/useVenue";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Country } from "react-phone-number-input";

const VenueForm = lazy(() => import("@diplomski/components/Venue/VenueForm"));

export const getServerSideProps: GetServerSideProps<{
  country_code: Country;
}> = async () => {
  const res = await fetch("https://ipapi.co/json/");
  const { country_code } = await res.json();

  return {
    props: {
      country_code,
    },
  };
};

export default function EditVenue({
  country_code,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        if (!result.error) {
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
            phone: venue.phone,
          }}
          buttonText="Update"
          onSubmit={onSubmit}
          country_code={country_code}
        />
      </Suspense>
    </>
  );
}
