import Head from "next/head";
import { lazy, Suspense } from "react";
import Map from "@diplomski/components/Map";

const Header = lazy(() => import("@diplomski/components/Header"));

export default function Home() {
  return (
    <>
      <Head>
        <title>Diplomski</title>
        <meta name="description" content="Find parties near you" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Suspense>
        <Header />
      </Suspense>
      <Suspense>
        <div className="flex">
          <div className="w-1/2">Venues on map</div>
          <div className="w-1/2"><Map /></div>
        </div>
      </Suspense>
    </>
  );
}
