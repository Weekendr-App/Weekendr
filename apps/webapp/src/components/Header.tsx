import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import home from "../../public/home-color.svg";

const Header: FC<{}> = () => {
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
      <Link className="text-white" href="/">
        Login / Signup
      </Link>
    </header>
  );
};

export default Header;
