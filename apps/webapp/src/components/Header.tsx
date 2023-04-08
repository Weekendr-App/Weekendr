import { FC, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import home from "../../public/home-color.svg";
import { useAuth } from "@diplomski/hooks/useAuth";
import { gql, useQuery } from "urql";
import { Role } from "@diplomski/gql/graphql";
import { useRouter } from "next/router";

const query = gql`
  query {
    me {
      role
    }
  }
`;

const Header: FC<{}> = () => {
  const { user, logout } = useAuth();
  const [{ data }] = useQuery({ query, pause: !user });
  const router = useRouter();

  const isOwner = useMemo(() => data?.me.role === Role.Owner, [data]);
  const headerItems = useMemo(() => {
    const items = [
      {
        title: "Profile",
        href: "/profile",
      },
    ];

    if (isOwner) {
      items.push({ title: "Add venue", href: "/venues/add" });
    }

    return items.map((item) => (
      <div className="flex" key={item.title}>
        <a
          className="hover:underline cursor-pointer"
          onClick={() => {
            if (router.asPath === item.href) {
              return;
            }
            router.push(item.href);
          }}
        >
          {item.title}
        </a>
        <p className="mx-2">|</p>
      </div>
    ));
  }, [isOwner, router]);

  return (
    <header className="bg-gray-800 px-6 flex items-center justify-between h-16">
      <Link href="/">
        <Image
          src={home}
          alt="home house"
          className="inline"
          width="24"
          height="24"
        />
      </Link>
      <div className="text-white">
        {!user ? (
          <Link href="/auth">Login</Link>
        ) : (
          <div className="flex items-center">
            {headerItems}
            <p>
              Logged in as:{" "}
              <strong
                className="hover:underline hover:cursor-pointer"
                onClick={logout}
              >
                {user.email}
              </strong>
            </p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
