import { Spinner } from "@diplomski/components/Spinner";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import useAddVenue from "@diplomski/hooks/useAddVenue";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback } from "react";
import { Country } from "react-phone-number-input";

const VenueForm = lazy(() => import("@diplomski/components/Venue/VenueForm"));

export const getServerSideProps: GetServerSideProps<{
  countryCode: Country;
}> = async (context: GetServerSidePropsContext) => {
  const ip =
    context.req.headers["x-forwarded-for"] || context.req.socket.remoteAddress;

  const res = await fetch(`https://ipapi.co/${ip}/country_code/`);
  const countryCode = (await res.text()) as Country;

  return {
    props: {
      countryCode,
    },
  };
};

export default function AddVenuePage({
  countryCode,
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
            countryCode,
          }}
          title="Add Venue"
          onSubmit={onSubmit}
          buttonText="Add"
        />
      </Suspense>
    </>
  );
}
