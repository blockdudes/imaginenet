import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainContent from "../components/buyGamePageComponents/MainContent";
import ImageGallery from "../components/buyGamePageComponents/ImageGallery";
import SecureCheckout from "../components/buyGamePageComponents/SecureCheckout";
import Header from "../components/buyGamePageComponents/Header";
import { ThirdwebContract, readContract } from "thirdweb";
import { GlobalContext } from "../context/Store";

const gameData = {
  name: "Game 1",
  cid: "wehihvbu09a093yibkbkb",
  token: "0x0000000000000000000000000000000000000000",
  creator: "Darab",
  price: "10eth",
  imageUrl: "",
};

const BuyGame = () => {
  const { id } = useParams();
  const { getContractInstance } = useContext(GlobalContext);

  const getGameByCid = async (id) => {
    console.log("contractInstance", getContractInstance());
    const res = await readContract({
      contract: getContractInstance(),
      method: "getGameByCid",
      params: [id],
    });
    console.log(res);
  };

  useEffect(() => {
    getGameByCid(id);
  }, [id]);
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
