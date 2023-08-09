import { AuthProvider } from "@weekendr/src/hooks/useAuth";
import { MapHoverProvider } from "@weekendr/src/hooks/useMapHover";
import "@weekendr/src/styles/globals.css";
import { UrqlProvider } from "@weekendr/src/utils/urql";
import type { AppProps } from "next/app";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Spinner } from "@weekendr/src/components/Spinner";

const Header = lazy(() => import("@weekendr/src/components/Header"));

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => console.log("scope is: ", registration.scope));
    }
  }, []);

  return (
    <AuthProvider>
      <UrqlProvider>
        <MapHoverProvider>
          <Suspense fallback={<Spinner />}>
            <Header />
          </Suspense>
          <Component {...pageProps} />
          <Toaster />
        </MapHoverProvider>
      </UrqlProvider>
    </AuthProvider>
  );
}
