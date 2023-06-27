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
import { useDarkMode } from "usehooks-ts";

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

export default function AddVenuePage({
  countryCode,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { addVenue, result } = useAddVenue();
  const router = useRouter();
  const { isDarkMode } = useDarkMode();

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
      <div
        className={`${isDarkMode && "dark"}`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="h-full dark:bg-gray-900 bg-gray-200 pt-10">
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
        </div>
      </div>
    </>
  );
}
