import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainContent from "../components/buyGamePageComponents/MainContent";
import Header from "../components/buyGamePageComponents/Header";
import { GlobalContext } from "../context/Store";
import { RingLoader } from "react-spinners";
import { Game, isGamePurchased } from "../utils/gameHelperFunctions";

const BuyGame = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState<Game>();
  const [isPurchased, setIsPurchased] = useState(false);

  const { allGames, handleGetGames, signer, contractInstance } =
    useContext(GlobalContext)!;
  console.log("allGames", allGames);

  useEffect(() => {
    handleGetGames().then(async (data) => {
      if (!data) return;
      console.log("resolved", data);
      const game = data.find((game) => game.cid == id);
      console.log("game", game);
      if (!game || !contractInstance) return;
      const isPurchased = await isGamePurchased(game.cid, contractInstance!);
      setIsPurchased(isPurchased);
      setGameData(game);
    });
  }, [signer]);

  console.log("gameData", gameData);

  if (!gameData)
    return (
      <div className="flex h-3/4 w-full mt-24 text-white justify-center items-center">
        <RingLoader color="white" />
      </div>
    );

  return (
    <div className="bg-gray-900 w-full min-h-screen text-white overflow-hidden  ">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <MainContent gameData={gameData} isPurchased={isPurchased} />
      </div>
    </div>
  );
};

export default BuyGame;
