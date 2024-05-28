import lighthouse from "@lighthouse-web3/sdk";
// import { Wallet, ethers } from "ethers";
import { Wallet } from "thirdweb/wallets";
import GameFactoryABI  from "../contractABI/GameFactory.json";
import { createThirdwebClient, getContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { calibration_testnet } from "../suportedChains/chains";

// declare global {
//   interface Window {
//     ethereum: ethers.providers.ExternalProvider;
//   }
// }

const client = createThirdwebClient({
  clientId: "7598ee309f7b5af02e9db5fbf6db0900",
});

// Replace with your actual API key
const apiKey: string = "bcba7cb1.ea146bd40cea4a01856ad7240c881015";
// Replace with your actual contract address
export const contractAddress: string = "0xA8006b4EA70e53FcA7A49e713e5d87393179D320";

const gameContract = getContract({
  client,
  chain: calibration_testnet,
  address: contractAddress,
  abi: GameFactoryABI.abi,
});

// // Define the Game interface
// interface Game {
//   cid: string;
//   name: string;
//   imageUrl: string;
//   price: ethers.BigNumber;
// }

// // Create a provider and signer for interacting with the Ethereum network
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// const contract = new ethers.Contract(
//   contractAddress,
//   GameFactoryABI.abi,
//   signer
// );

/**
 * Publishes a game to the blockchain and uploads the game file to Lighthouse.
 * @param game - The game file to be uploaded.
 * @param user - The wallet of the user publishing the game.
 */
export const publishGame = async (
  game: File,
  user: Wallet,
  name: string,
  symbol: string,
  price: number,
  imageUrl: string
): Promise<void> => {
  console.log("game",game);
  console.log("user",user);
  console.log("name",name);
  console.log(symbol);
  console.log(price);
  console.log(imageUrl);
  // Upload the game to the Lighthouse network
  
  const userAddress=await user.getAccount().address;
  const signerMsg=await user.getAccount().signMessage({message:"Authorize upload"});
  const { data } = await lighthouse.uploadEncrypted(
    game,
    apiKey,
    userAddress,
    signerMsg
  );
  console.log(data)
  const cid: string = data[0].Hash;


  // Call publishGame function from the contract
  const tx =prepareContractCall({
    contract: gameContract,
    method: "publishGame",
    params: [cid, name, symbol, price, imageUrl],
  })

  var result = await sendAndConfirmTransaction({
    transaction: tx,
    account: user.getAccount(),
  });
  console.log(result)

  // await .publishGame(cid, name, symbol, price, imageUrl);
};

/**
 * Retrieves and decrypts a game file from Lighthouse using the provided CID.
 * @param cid - The CID of the game file.
 * @param user - The wallet of the user retrieving the game.
 * @returns The decrypted game file.
 */
export const getGame = async (cid: string, user: Wallet): Promise<File> => {
  // Get the encrypted game from Lighthouse using the given CID
  const { data } = await lighthouse.fetchEncryptionKey(
    cid,
    user.address,
    await user.signMessage("Authorize decryption")
  );
  const fileEncryptionKey: string = data.key!;

  // Decrypt the game using the file encryption key
  const decryptedGame: File = await lighthouse.decryptFile(
    cid,
    fileEncryptionKey
  );

  return decryptedGame;
};

/**
 * Purchases a game by calling the buyGame function in the contract.
 * @param cid - The CID of the game to be purchased.
 * @param user - The wallet of the user purchasing the game.
 */
export const buyGame = async (cid: string): Promise<void> => {
  // Retrieve game details from the contract
  const game = await contract.getGameByCid(cid);
  const price: ethers.BigNumber = game.price;

  // Call buyGame function from the contract
  await contract.buyGame(cid, { value: price.toString() });
};

/**
 * Retrieves the list of games from the blockchain.
 * @param user - The wallet of the user retrieving the game list.
 * @returns A list of games with their details.
 */
export const getGameList = async (): Promise<Game[]> => {
  // Call getGames function from the contract
  const games: Game[] = await contract.getGames();

  // Map and return the list of games
  return games.map((game: any) => ({
    cid: game.cid,
    name: game.name,
    imageUrl: game.imageUrl,
    price: game.price,
  }));
};

/**
 * Checks if a game has been purchased by the user.
 * @param cid - The CID of the game.
 * @param user - The wallet of the user.
 * @returns A boolean indicating whether the game has been purchased.
 */
export const isGamePurchased = async (cid: string): Promise<boolean> => {
  // Call isGameOwned function from the contract
  const isOwned: boolean = await contract.isGameOwned(cid);

  return isOwned;
};
