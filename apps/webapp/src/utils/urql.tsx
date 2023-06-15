import { useAuth } from "@diplomski/hooks/useAuth";
import { FC, ReactNode, useMemo } from "react";
import { toast } from "react-hot-toast";
import {
  createClient,
  Provider,
  cacheExchange,
  fetchExchange,
  dedupExchange,
  errorExchange,
} from "urql";
// NOTE: This will only import the default Tailwind colors.
// If we need custom colors we need to use resolveConfig instead.
import colors from "tailwindcss/colors";

interface Props {
  children: ReactNode;
}

export const UrqlProvider: FC<Props> = ({ children }) => {
  const { user } = useAuth();

  const client = useMemo(
    () =>
      createClient({
        url:
          process.env.NODE_ENV === "production"
            ? "https://9111-46-40-15-31.ngrok-free.app/graphql"
            : "http://localhost:4000/graphql",
        exchanges: [
          dedupExchange,
          cacheExchange,
          errorExchange({
            onError: (error) => {
              const message =
                error.graphQLErrors &&
                error.graphQLErrors.length >= 1 &&
                error.graphQLErrors[0].message
                  ? error.graphQLErrors[0].message
                  : "An error occurred";

              toast.error(message, {
                // Class names were being overwritten by the toast styles
                style: {
                  backgroundColor: colors.gray[900],
                  color: colors.white,
                },
              });
            },
          }),
          fetchExchange,
        ],
        ...(user &&
          user.token && {
            fetchOptions: {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            },
          }),
      }),
    [user]
  );

  return <Provider value={client}>{children}</Provider>;
};
