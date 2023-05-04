import RegistrationForm from "@diplomski/components/Form/RegistrationForm";
import { useAuth } from "@diplomski/hooks/useAuth";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const { user } = useAuth();
  const router = useRouter();

  // if (user) {
  //   router.push("/");
  // }

  return (
    <>
      <Head>
        <title>Sign Up</title>
      </Head>
      <RegistrationForm />
    </>
  );
}
