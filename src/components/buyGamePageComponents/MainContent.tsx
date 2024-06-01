import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Store";
import { buyGame } from "../../utils/gameHelperFunctions";
import { PropagateLoader } from "react-spinners";
import { Game } from "../../utils/gameHelperFunctions";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const MainContent = ({
  gameData,
  isPurchased,
}: {
  gameData: Game;
  isPurchased: boolean;
}) => {
  const navigate = useNavigate();
  const { contractInstance } = useContext(GlobalContext)!;
  const [isLoading, setIsLoading] = useState(false);
  const [isGamePurchased, setIsGamePurchased] = useState(isPurchased);
  const handleBuyGame = async (gameCid: string) => {
    try {
      setIsLoading(true);
      const res = await buyGame(gameCid, gameData.price, contractInstance!);

      const reciept = await res.wait();

      console.log("res", reciept);
      setIsGamePurchased(true);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex rounded-lg p-20 gap-4">
      <div className="w-[60%]">
        <img
          src={gameData.imageUrl}
          crossOrigin="anonymous"
          alt="Produce Farm Bundle"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="">
        <h2 className="text-4xl font-bold">{gameData.name}</h2>
        {/* <p className="mt-2 text-sm text-[#ddd0fe]">
          developed by: {gameData.creator}
        </p> */}
        <div className="mt-4">
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs bg-gray-800 p-2 rounded">
              <h1 className="text-gray-400 truncate">
                <span className="text-[#ddd0fe] font-medium">Cid:</span>{" "}
                {gameData.cid}
              </h1>
            </div>
            <div className="flex items-center justify-between text-xs bg-gray-800 p-2 rounded mt-2">
              <h1 className="truncate text-gray-400">
                <span className="text-[#ddd0fe] font-medium">Token:</span>{" "}
                {gameData.token}
              </h1>
            </div>
          </div>
          <div className="mt-8 flex items-center">
            {isLoading ? (
              <PropagateLoader className="ml-24 mt-3" color="white" />
            ) : isGamePurchased ? (
              <button
                className="bg-secondary hover:bg-blue-700 text-white py-4 px-20 rounded"
                onClick={() => navigate(`/play/${gameData.cid}`)}
              >
                Play
              </button>
            ) : (
              <button
                className="bg-secondary hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => handleBuyGame(gameData.cid)}
              >
                Buy for{" "}
                {ethers.utils.formatEther(gameData.price.toString()).toString()}{" "}
                eth
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
