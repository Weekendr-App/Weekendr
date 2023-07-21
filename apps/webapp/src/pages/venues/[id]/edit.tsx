import Head from "next/head";
import { lazy, Suspense, useCallback } from "react";
import { Spinner } from "@diplomski/components/Spinner";
import useEditVenue from "@diplomski/hooks/useEditVenue";
import useVenue from "@diplomski/hooks/useVenue";
import { VenueFormValues } from "@diplomski/components/Venue/VenueForm";
import { useRouter } from "next/router";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { Country } from "react-phone-number-input";

const VenueForm = lazy(() => import("@diplomski/components/Venue/VenueForm"));

export const getServerSideProps: GetServerSideProps<{
  countryCode: Country;
}> = async (context: GetServerSidePropsContext) => {
  const ip =
    context.req.headers["x-forwarded-for"] || context.req.socket.remoteAddress;
  const res = await fetch(`https://ipapi.co/${ip}/country_code/`);
  let countryCode = await res.text();
  if (countryCode === "Undefined") {
    countryCode = "RS";
  }

  return {
    props: {
      countryCode: countryCode as Country,
    },
  };
};

export default function EditVenue({
  countryCode,
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
      <div style={{ height: "calc(100vh - 64px)" }}>
        <div className="h-full bg-gray-900 pt-10">
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
                countryCode, // TODO: Can we get this from the phone number?
              }}
              buttonText="Update"
              onSubmit={onSubmit}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}
