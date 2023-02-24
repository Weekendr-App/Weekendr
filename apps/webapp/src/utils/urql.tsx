import { useAuth } from "@diplomski/hooks/useAuth";
import { FC, ReactNode, useMemo } from "react";
import { createClient, Provider } from "urql";

interface Props {
  children: ReactNode;
}

export const UrqlProvider: FC<Props> = ({ children }) => {
  const { user } = useAuth();

  const client = useMemo(
    () =>
      createClient({
        url: "http://localhost:4000/graphql",
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
