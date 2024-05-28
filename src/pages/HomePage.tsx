import { readContract } from "thirdweb";
import { ConnectButton, useActiveWallet } from "thirdweb/react";

import CategoryCard from "../components/homePageComponents/CategoryCard";

import { useContext } from "react";
import { GlobalContext } from "../context/Store";
import { publishGame } from "../utils/lighthouseFunctions";
import { Wallet } from "thirdweb/wallets";

const categories = [
  { name: "Ready-made games", price: "10eth", imageUrl: "/path/to/image1.png" },
  { name: "Custom games", price: "20eth", imageUrl: "/path/to/image2.png" },
  { name: "Game templates", price: "15eth", imageUrl: "/path/to/image3.png" },
  { name: "Game collections", price: "14eth", imageUrl: "/path/to/image4.png" },
];
const HomePage = () => {
  const wallet: Wallet = useActiveWallet();
  const { getContractInstance, client } = useContext(GlobalContext);

  const handleGetGames = async () => {
    const result = await readContract({
      contract: getContractInstance(),
      method: "getGames",
    });
    console.log(result);
  };

  const uploadGame = async () => {
    const result = publishGame(
      new File([], " "),
      wallet,
      "Game",
      "GME",
      1,
      "https://example.com/image.png"
    );
  };

  return (
    <div className="flex w-full">
      {/* <Sidebar /> */}

      <div className="flex-grow bg-gray-900">
        <div className="fixed right-2 top-2">
          <ConnectButton client={client} />
        </div>
        <button className="bg-white" onClick={() => handleGetGames()}>
          getButton
        </button>
        <button className="bg-white" onClick={() => uploadGame()}>
          uploadGame
        </button>
        <h1 className="ml-4 text-primary mt-12 font-semibold text-2xl">
          Market Place
        </h1>
        <div className="p-4 grid grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              name={category.name}
              image={category.imageUrl}
              price={category.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
