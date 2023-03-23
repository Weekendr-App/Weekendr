import { Spinner } from "@diplomski/components/Spinner";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback } from "react";
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

export default function AddVenuePage({
  country_code,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
        <VenueForm
          initialValues={{
            name: "",
            address: "",
            latitude: 0,
            longitude: 0,
            picture: "",
            phone: "",
            countryCode: country_code
          }}
          title="Add Venue"
          onSubmit={onSubmit}
          buttonText="Add"
        />
      </Suspense>
    </>
  );
}
