import { gql, useMutation } from "urql";

const SIGN_UP_MUTATION = gql`
  mutation RegisterUser($user: FirebaseUserCustom!) {
    registerUser(user: $user) {
      message
    }
  }
`;

export default function useSignUp() {
  const [result, execute] = useMutation(SIGN_UP_MUTATION);

  return {
    loading: result.fetching,
    signUp: (user: {
      email: string;
      password: string;
      taxReturnsPicture: string;
    }) => execute({ user }),
  };
}
