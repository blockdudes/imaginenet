import { useNavigate } from "react-router-dom";
import GameImage from "../../assets/thumbnail.png";
import { readContract } from "thirdweb";
import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context/Store";

const CategoryCard = ({ name, image, price, cid }) => {
  const { getContractInstance } = useContext(GlobalContext);
  const isGameOwned = async (id) => {
    // Call isGameOwned function from the contract
    const res = await readContract({
      contract: getContractInstance(),
      method: "isGameOwned",
      params: [id],
    });

    console.log(res);
  };
  useEffect(() => {
    isGameOwned(cid);
  }, cid);
  const navigate = useNavigate();
  return (
    <div
      className=" rounded-t-xl flex flex-col shadow-sm shadow-black cursor-pointer relative"
      onClick={() => navigate(`/buy/${cid}`)}
    >
      <div className="w-[50x] h-[20px] flex items-center rounded-md text-xs px-3 py-3 absolute text-white font-semibold  top-2 left-2 bg-[#32323b]">
        <p>{price}</p>
      </div>
      <img
        src={GameImage}
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
