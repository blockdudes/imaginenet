import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Header = () => {
  // const navigate = useNavigate();
  return (
    <div className=" flex gap-1 items-center  p-4">
      <button
        className="text-white flex justify-center items-center bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 gap-1"
        onClick={() => window.history.back()}
      >
        <MdOutlineKeyboardArrowLeft className="flex justify-center items-center" />
        Go Back
      </button>
    </div>
  );
};

export default Header;
