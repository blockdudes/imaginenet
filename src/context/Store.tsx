import { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import GameFactoryABI from "../contractABI/GameFactory.json";
import { getGameList } from "../utils/gameHelperFunctions";

export const GlobalContext = createContext(null);

// const contractAddress = "0x118e253ad66e7d30c8bee487eaa42463e9cd0f78";

//on tenderly
const contractAddress = "0x6b45ac5fbf1822fecfa585e87b0b4ea44c31bb54";

export const GlobalStateProvider = ({ children }) => {
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [contractInstance, setContractInstance] = useState(null);
  const [allGames, setAllGames] = useState(
    [] || JSON.parse(localStorage.getItem("allGames"))
  );
  const [homePageLoader, setHomePageLoader] = useState(false);

  const walletConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    if (chainId !== 1) {
      //add chain
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: "0x1",
          chainName: "filecoin",
          rpcUrls: [
            "https://virtual.mainnet.rpc.tenderly.co/2eec2500-1e99-43a3-825a-8deeda67c1fe",
          ],
          nativeCurrency: {
            symbol: "ETH",
            decimals: 18,
          },
        },
      ]);
    }

    console.log("chainId", chainId);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner(accounts[0]);

    const contract = new ethers.Contract(
      contractAddress,
      GameFactoryABI.abi,
      signer
    );
    setContractInstance(contract);

    setSigner(signer);

    setAddress(accounts[0]);
    console.log("signer", signer);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const { chainId } = await provider.getNetwork();
        if (chainId !== 1) {
          alert("this chain is not supported connect your wallet again");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("chainChanged", () => {
          console.log("this chain is not supported");
        });
      }
    };
  }, []);

  const handleGetGames = async () => {
    try {
      console.log("me to chala hu");
      setHomePageLoader(true);
      if (!contractInstance) return;
      const res = await getGameList(contractInstance);
      setAllGames(res);
      localStorage.setItem("allGames", JSON.stringify(res));
      setHomePageLoader(false);
      return res;
    } catch (error) {
      console.log("error", error);
      setHomePageLoader(false);
    }
  };

  useEffect(() => {
    walletConnect();
  }, []);

  

  return (
    <GlobalContext.Provider
      value={{
        walletConnect,
        signer,
        address,
        contractInstance,
        allGames,
        setAllGames,
        handleGetGames,
        homePageLoader,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
