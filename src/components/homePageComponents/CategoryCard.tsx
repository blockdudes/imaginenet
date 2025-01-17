import { useNavigate } from "react-router-dom";
import { Game } from "../../utils/gameHelperFunctions";
import { ethers } from "ethers";

const CategoryCard = ({ name, imageUrl, price, cid }: Game) => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-xl overflow-clip flex flex-col shadow-sm shadow-black cursor-pointer relative"
      onClick={() => navigate(`/buy/${cid}`)}
    >
      <div className="w-[50x] h-[20px] flex items-center rounded-md text-xs px-3 py-3 absolute text-white font-semibold  top-2 left-2 bg-[#32323b]">
        <p>{ethers.utils.formatEther(price.toBigInt()).toString()} eth</p>
      </div>
      <img
        src={imageUrl}
        crossOrigin="anonymous"
        alt={name}
        className="w-full rounded-t-xl h-[80%] object-cover"
      />
      <div className="text-white  w-full h-[20%] text-center bg-[#32323b]">
        <p className="text-sm p-2">{name}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
