import { useContext, useState } from "react";
import { GlobalContext } from "../../context/Store";
import { toast } from "react-toastify";
import GameImage from "../../assets/thumbnail.png";
import { buyGame } from "../../utils/gameHelperFunctions";
import { PropagateLoader } from "react-spinners";

const MainContent = ({ gameData }) => {
  const { contractInstance } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const handleBuyGame = async (gameCid) => {
    try {
      setIsLoading(true);
      const res = await buyGame(
        gameCid,
        gameData?.price._hex,
        contractInstance
      );

      const reciept = await res.wait();

      console.log("res", reciept);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };
  return (
    <div className=" w-full flex rounded-lg p-20 overflow-hidden">
      <div className="w-[60%]">
        <img
          src={GameImage}
          alt="Produce Farm Bundle"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="pl-4 w-[40%]">
        <h2 className="text-2xl font-bold">{gameData.name}</h2>
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
          <div className="mt-4 flex justify-between items-center">
            {isLoading ? (
              <PropagateLoader color="white" />
            ) : (
              <button
                className="bg-[#4f28cd] hover:bg-blue-700 text-white py-2 px-4 rounded"
                onClick={() => handleBuyGame(gameData.cid)}
              >
                Buy for {Number(gameData.price._hex / 1e18)} eth
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
