import { createContext } from "react";
import { createThirdwebClient, getContract } from "thirdweb";
import GameFactoryABI from "../contractABI/GameFactory.json";

export const GlobalContext = createContext(null);
const contractAddress = "0xA8006b4EA70e53FcA7A49e713e5d87393179D320";

export const GlobalStateProvider = ({ children }) => {
  const client = createThirdwebClient({
    clientId: "7598ee309f7b5af02e9db5fbf6db0900",
  });

  const getContractInstance = () => {
    const contract = getContract({
      client,
      address: contractAddress,
      abi: GameFactoryABI.abi,
    });
    return contract;
  };

  return (
    <GlobalContext.Provider
      value={{
        client,
        getContractInstance,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
