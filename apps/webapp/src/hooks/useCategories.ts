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
  const [result] = useQuery<{ categories: Category[] }>({ query });
  const { data, fetching, error } = result;

  return {
    categories: data?.categories ?? [],
    fetching,
    error,
  };
}
