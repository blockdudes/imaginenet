import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";

const Sidebar = () => {
  const path = useLocation().pathname;

  return (
    <div className="w-64 h-screen bg-gray-900 text-white  flex flex-col  border-r border-white/60">
      <div className="flex justify-start items-center gap-2 mx-3">
        <img src={logo} alt="logo" className="w-10 h-10 my-4" />
        <h1 className="text-xl">Imagine.net</h1>
      </div>
      <nav className="flex-grow">
        <a
          href="/"
          className={`block py-2.5 px-4 ${
            path == "/" ? "bg-secondary" : "hover:bg-gray-700"
          }`}
        >
          Shop
        </a>
        <a
          href="#"
          className={`block py-2.5 px-4 ${
            path == "/learn" ? "bg-secondary" : "hover:bg-gray-700"
          }`}
        >
          Learn
        </a>
      </nav>
      <div className="p-4">
        <a href="#" className="block py-2.5 px-4 hover:bg-gray-700">
          Preferences
        </a>
        <a href="#" className="block py-2.5 px-4 hover:bg-gray-700">
          About Imagine.net
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
