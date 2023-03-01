import { AuthProvider } from "@diplomski/hooks/useAuth";
import { MapHoverProvider } from "@diplomski/hooks/useMapHover";
import "@diplomski/styles/globals.css";
import { UrqlProvider } from "@diplomski/utils/urql";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UrqlProvider>
        <MapHoverProvider>
          <Component {...pageProps} />
        </MapHoverProvider>
      </UrqlProvider>
    </AuthProvider>
  );
}
