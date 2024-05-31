import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainContent from "../components/buyGamePageComponents/MainContent";
import ImageGallery from "../components/buyGamePageComponents/ImageGallery";
import SecureCheckout from "../components/buyGamePageComponents/SecureCheckout";
import Header from "../components/buyGamePageComponents/Header";
import { ThirdwebContract, readContract } from "thirdweb";
import { GlobalContext } from "../context/Store";
import { getGameList } from "../utils/gameHelperFunctions";
import { RingLoader } from "react-spinners";

const BuyGame = () => {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);

  const { allGames, handleGetGames, signer, contractInstance } =
    useContext(GlobalContext);
  console.log("allGames", allGames);

  useEffect(() => {
    handleGetGames().then((data) => {
      console.log("resoved", data);
      setGameData(data.find((item) => item?.cid == id));
    });
  }, [signer]);

  console.log("gameData", gameData);

  if (!gameData)
    return (
      <div className="flex w-full mt-24 text-white justify-center">
        <RingLoader color="white" />
      </div>
    );

  return (
    <div className="bg-gray-900 w-full min-h-screen text-white">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <MainContent gameData={gameData} />
        {/* <ImageGallery /> */}
        {/* <SecureCheckout /> */}
      </div>
    </div>
  );
};

export default BuyGame;
