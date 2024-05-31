import { useContext, useEffect } from "react";
import CategoryCard from "../components/homePageComponents/CategoryCard";
import { GlobalContext } from "../context/Store";
import { RingLoader } from "react-spinners";

const HomePage = () => {
  const {
    walletConnect,
    contractInstance,
    allGames,
    homePageLoader,
    handleGetGames,
    signer,
    address,
  } = useContext(GlobalContext)!;

  const handleWalletConnect = async () => {
    await walletConnect();
  };

  useEffect(() => {
    handleGetGames();
  }, [contractInstance]);

  return (
    <div className="flex w-full">
      {/* <Sidebar /> */}

      <div className="flex-grow bg-blue">
        <div className="fixed right-4 top-4 bg-secondary font-semibold text-primary-text rounded-lg">
          {signer != null ? (
            <button className="w-[200px] px-5 py-2">
              <p className="truncate text-secondary-text">{address}</p>
            </button>
          ) : (
            <button
              className="w-[200px] px-5 py-2"
              onClick={handleWalletConnect}
            >
              Connect Wallet
            </button>
          )}
        </div>
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
                imageUrl={item.imageUrl}
                price={item.price}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
