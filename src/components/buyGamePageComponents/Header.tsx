import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

const Header = () => {
  // const navigate = useNavigate();
  return (
    <div className=" flex gap-1 items-center  p-4">
      <MdOutlineKeyboardArrowLeft />
      <button className="text-white" onClick={() => window.history.back()}>
        Back
      </button>
    </div>
  );
};

export default Header;
