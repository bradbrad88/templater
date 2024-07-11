import { HomeIcon } from "../../common/icons";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="bg-zinc-800 h-full flex items-center px-8 gap-8 text-white">
      <HomeIcon size={24} fill="white" />
      <Navbar />
    </header>
  );
}

export default Header;
