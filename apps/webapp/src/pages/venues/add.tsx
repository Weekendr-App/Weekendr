import { Spinner } from "@weekendr/src/components/Spinner";
import { VenueFormValues } from "@weekendr/src/components/Venue/VenueForm";
import useAddVenue from "@weekendr/src/hooks/useAddVenue";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { lazy, Suspense, useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Country } from "react-phone-number-input";
import Modal from "react-modal";

const Button = lazy(() => import("@weekendr/src/components/Form/Button"));

const VenueForm = lazy(
  () => import("@weekendr/src/components/Venue/VenueForm")
);

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
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      console.log({ croppedArea, croppedAreaPixels });
    },
    []
  );

  const [open, setOpen] = useState(false);

  const onCloseModal = () => setOpen(false);
  const cropPhoto = () => {};
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
      <Modal
        isOpen={open}
        style={{
          overlay: { position: "absolute", top: "4rem" },
          content: { background: "#888" },
        }}
        onRequestClose={onCloseModal}
      >
        <div>
          <Cropper
            image="/icons/apple-splash-1170-2532.jpg"
            crop={crop}
            zoom={zoom}
            aspect={3 / 4}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div className="controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(Number(e.target.value));
            }}
            className="zoom-range"
          />
          <div className="flex gap-5">
            <Suspense fallback={<Spinner />}>
              <Button onClick={onCloseModal}>Cancel</Button>
              <Button onClick={cropPhoto}>Crop</Button>
            </Suspense>
          </div>
        </div>
      </Modal>
      <div style={{ height: "calc(100vh - 64px)" }}>
        <div className="pt-10">
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
