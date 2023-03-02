import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import home from "../../public/home-color.svg";
import { useAuth } from "@diplomski/hooks/useAuth";

const headerItems = [
  {
    title: "Profile",
    href: "/profile",
  },
  {
    title: "Add venue",
    href: "/venues/add",
  },
].map((item) => (
  <>
    <Link className="hover:underline" href={item.href}>
      {item.title}
    </Link>
    <p className="mx-2">|</p>
  </>
));

const Header: FC<{}> = () => {
  const { user, logout } = useAuth();

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
