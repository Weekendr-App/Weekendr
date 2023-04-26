import { Category } from "@diplomski/gql/graphql";
import { gql, useQuery } from "urql";

const query = gql`
  query AllCategories {
    categories {
      id
      name
    }
  }
`;

export default function useCategories() {
  const [{ data, fetching, error }] = useQuery<{ categories: Category[] }>({
    query,
  });

  return {
    categories: data?.categories ?? [],
    fetching,
    error,
  };
}
