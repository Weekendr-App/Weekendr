import {
  MutationRegisterUserArgs,
  RegisterUserInput,
  RegisterUserResponse,
} from "@weekendr/src/gql/graphql";
import { gql, useMutation } from "urql";

const SIGN_UP_MUTATION = gql`
  mutation RegisterUser($user: RegisterUserInput!) {
    registerUser(user: $user) {
      message
      success
    }
  }
`;

export default function useSignUp() {
  const [result, execute] = useMutation<
    { registerUser: RegisterUserResponse },
    MutationRegisterUserArgs
  >(SIGN_UP_MUTATION);

  return {
    result,
    loading: result.fetching,
    signUp: (user: RegisterUserInput) => execute({ user }),
  };
}
