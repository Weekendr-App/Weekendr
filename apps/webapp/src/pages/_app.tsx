import { AuthProvider } from "@diplomski/hooks/useAuth";
import { MapHoverProvider } from "@diplomski/hooks/useMapHover";
import "@diplomski/styles/globals.css";
import { UrqlProvider } from "@diplomski/utils/urql";
import type { AppProps } from "next/app";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";

const Header = lazy(() => import("@diplomski/components/Header"));

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UrqlProvider>
        <MapHoverProvider>
          <Header />
          <Component {...pageProps} />
          <Toaster />
        </MapHoverProvider>
      </UrqlProvider>
    </AuthProvider>
  );
}
