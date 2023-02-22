import "@diplomski/styles/globals.css";
import type { AppProps } from "next/app";
import { createClient, Provider } from "urql";

const client = createClient({
  url: "http://localhost:4000/graphql",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}
