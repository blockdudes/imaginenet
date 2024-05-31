import { useContext, useEffect, useState } from "react";
import CategoryCard from "../components/homePageComponents/CategoryCard";
import { GlobalContext } from "../context/Store";
import { getGameList } from "../utils/gameHelperFunctions";
import { RingLoader } from "react-spinners";

const categories = [
  { name: "Ready-made games", price: "10eth", imageUrl: "/path/to/image1.png" },
  { name: "Custom games", price: "20eth", imageUrl: "/path/to/image2.png" },
  { name: "Game templates", price: "15eth", imageUrl: "/path/to/image3.png" },
  { name: "Game collections", price: "14eth", imageUrl: "/path/to/image4.png" },
];
const HomePage = () => {
  const {
    walletConnect,
    contractInstance,
    allGames,
    setAllGames,
    homePageLoader,
    handleGetGames,
  } = useContext(GlobalContext);

  const uploadGame = async () => {};

  const handleWalletConnect = async () => {
    await walletConnect();
  };

  useEffect(() => {
    handleGetGames();
  }, [contractInstance]);

  useEffect(() => {
    walletConnect();
  }, []);

  return (
    <div className="flex w-full">
      {/* <Sidebar /> */}

      <div className="flex-grow bg-gray-900">
        <div
          className="fixed right-2 top-2 text-white"
          onClick={() => handleWalletConnect()}
        >
          Connect Wallet
        </div>
        {/* <button className="bg-white" onClick={() => uploadGame()}>
          uploadGame
        </button> */}
        <h1 className="ml-4 text-primary mt-12 font-semibold text-2xl">
          Market Place
        </h1>
        {homePageLoader ? (
          <div className="flex w-full mt-24 text-white justify-center">
            <RingLoader color="white" />
          </div>
        ) : (
          <div className="p-4 grid grid-cols-4 gap-4">
            {allGames?.map((item, index) => (
              <CategoryCard
                key={index}
                cid={item.cid}
                name={item.name}
                image={item.imageUrl}
                price={Number(item.price._hex)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
