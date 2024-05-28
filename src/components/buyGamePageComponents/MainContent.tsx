import { useContext } from "react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveWallet } from "thirdweb/react";
import { GlobalContext } from "../../context/Store";

const MainContent = ({ gameData }) => {
  const wallet = useActiveWallet();
  console.log(wallet, "wallet");
  const { getContractInstance } = useContext(GlobalContext);
  const handleBuyGame = async (gameCid) => {
    const tx = prepareContractCall({
      contract: getContractInstance(),
      method: "buyGame",
      params: [gameCid],
    });

    var result = await sendAndConfirmTransaction({
      transaction: tx,
      account: wallet.getAccount(),
    });
    console.log(result);
  };
  return (
    <div className=" w-full flex rounded-lg p-20 overflow-hidden">
      <div className="w-[50%]">
        <img
          src={
            "https://images.pexels.com/photos/1329644/pexels-photo-1329644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          }
          alt="Produce Farm Bundle"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="pl-4 w-[40%]">
        <h2 className="text-2xl font-bold">{gameData.name}</h2>
        <p className="mt-2 text-sm text-[#ddd0fe]">
          developed by: {gameData.creator}
        </p>
        <div className="mt-4">
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs bg-gray-800 p-2 rounded">
              <h1 className="text-gray-400">
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
            <button
              className="bg-[#4f28cd] hover:bg-blue-700 text-white py-2 px-4 rounded"
              onClick={() => handleBuyGame(gameData.cid)}
            >
              Buy for {gameData.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
