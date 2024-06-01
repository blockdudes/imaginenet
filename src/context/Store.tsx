import React, { createContext, useEffect, useState } from "react";
import { ethers } from "ethers";

import GameFactoryABI from "../contractABI/GameFactory.json";
import { Game, getGameList } from "../utils/gameHelperFunctions";

export const GlobalContext = createContext<{
  walletConnect: () => Promise<void>;
  signer: ethers.providers.JsonRpcSigner | undefined;
  address: string | undefined;
  contractInstance: ethers.Contract | undefined;
  allGames: Game[];
  setAllGames: React.Dispatch<React.SetStateAction<Game[]>>;
  handleGetGames: () => Promise<Game[] | undefined>;
  homePageLoader: boolean;
} | null>(null);

const contractAddress = "0xD378DeF344B694f20D20727751d2Cd1132932707";

export const GlobalStateProvider = ({ children }: { children: any }) => {
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [address, setAddress] = useState<string>();
  const [contractInstance, setContractInstance] = useState<ethers.Contract>();
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [homePageLoader, setHomePageLoader] = useState<boolean>(false);

  const walletConnect = async (): Promise<void> => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const { chainId } = await provider.getNetwork();

    if (chainId !== 1) {
      //add chain
      await provider.send("wallet_addEthereumChain", [
        {
          chainId: "0x61",
          chainName: "BNB Smart Chain Testnet",
          rpcUrls: ["https://endpoints.omniatech.io/v1/bsc/testnet/public"],
          nativeCurrency: {
            symbol: "tBNB",
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
