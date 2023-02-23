import { AuthProvider } from "@diplomski/hooks/useAuth";
import "@diplomski/styles/globals.css";
import { UrqlProvider } from "@diplomski/utils/urql";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UrqlProvider>
        <Component {...pageProps} />
      </UrqlProvider>
    </AuthProvider>
  );
}
