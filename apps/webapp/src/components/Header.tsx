import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import home from "../../public/home-color.svg";
import { useAuth } from "@diplomski/hooks/useAuth";

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
          <p>
            Logged in as:{" "}
            <strong
              className="hover:underline hover:cursor-pointer"
              onClick={logout}
            >
              {user.email}
            </strong>
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;
