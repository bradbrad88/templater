import { Link } from "react-router-dom";
import { HomeIcon } from "../../common/icons";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="bg-zinc-800 h-full flex items-center px-8 gap-8 text-white">
      <Link to={"/"}>
        <HomeIcon size={24} fill="white" />
      </Link>
      <Navbar />
    </header>
  );
}

export default Header;
