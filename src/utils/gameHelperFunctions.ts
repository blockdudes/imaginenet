import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";
import { ThirdwebContract, readContract } from "thirdweb";

declare global {
  interface Window {
    ethereum: ethers.providers.ExternalProvider;
  }
}

// Define the Game interface
interface Game {
  cid: string;
  name: string;
  imageUrl: string;
  price: ethers.BigNumber;
}

function splitStringToBytes32Array(inputString: string): string[] {
  const bytes32Array: string[] = [];
  for (let i = 0; i < inputString.length; i += 31) {
    let chunk = inputString.slice(i, i + 31);
    let bytes32 = ethers.utils.formatBytes32String(chunk);
    bytes32Array.push(bytes32);
  }
  console.log("Bytes32 Array:", bytes32Array);
  return bytes32Array;
}

/**
 * Generates an API key for the user.
 * @param user - The wallet of the user.
 * @returns The generated API key.
 */
const generateApiKey = async (
  user: ethers.providers.JsonRpcSigner
): Promise<string> => {
  // Get the authorization message
  const authMessage = (await lighthouse.getAuthMessage(await user.getAddress()))
    .data.message!;
  const signedMessage = await user.signMessage(authMessage);

  // Generate the API key
  const apiKeyResponse = await lighthouse.getApiKey(
    await user.getAddress(),
    signedMessage
  );
  const apiKey = apiKeyResponse.data.apiKey;
  console.log("Api Key:", apiKey);

  return apiKey;
};

/**
 * Adds an access condition to the encrypted file.
 * @param cid - The CID of the file.
 * @param user - The wallet of the user adding the access condition.
 */
const addAccessCondition = async (
  cid: string,
  user: ethers.providers.JsonRpcSigner,
  contract: ethers.Contract
): Promise<void> => {
  const authMessage = (await lighthouse.getAuthMessage(await user.getAddress()))
    .data.message!;
  console.log("Auth Message:", authMessage);
  const signedMessage = await user.signMessage(authMessage);
  console.log("Signed Message:", signedMessage);

  // Define the access condition
  const accessConditions = [
    {
      id: 1,
      chain: "Calibration",
      method: "isGameOwned",
      standardContractType: "Custom",
      contractAddress: contract.address,
      returnValueTest: {
        comparator: "==",
        value: "true",
      },
      parameters: [splitStringToBytes32Array(cid)],
      inputArrayType: ["bytes32[]"],
      outputType: "bool",
    },
  ];

  console.log("Access Conditions:", accessConditions);

  const aggregator = "([1])";

  console.log("Aggregator:", aggregator);

  const userAddress = await user.getAddress();

  console.log(userAddress, cid, signedMessage, accessConditions, aggregator);

  // Apply the access condition to the file
  const res = await lighthouse.applyAccessCondition(
    userAddress,
    cid,
    signedMessage,
    accessConditions,
    aggregator
  );

  console.log(res.data);
};

/**
 * Publishes a game to the blockchain and uploads the game file to Lighthouse.
 * @param game - The game file to be uploaded.
 * @param user - The wallet of the user publishing the game.
 */
export const publishGame = async (
  contract: ethers.Contract,
  game: FileList,
  user: ethers.providers.JsonRpcSigner,
  name: string,
  symbol: string,
  price: ethers.BigNumber,
  imageUrl: string
): Promise<void> => {
  // Function to sign the authentication message using Wallet
  console.log("contract", contract);
  const signAuthMessage = async (user: ethers.providers.JsonRpcSigner) => {
    if (window.ethereum) {
      try {
        const signerAddress = await user.getAddress();
        const message  = (await lighthouse.getAuthMessage(signerAddress))
          .data.message!;
        const signature = await user.signMessage(message);
        return { signature, signerAddress };
      } catch (error) {
        console.error("Error signing message with Wallet", error);
        return null;
      }
    } else {
      console.log("Please install Wallet!");
      return null;
    }
  };

  // Function to upload the encrypted file
  const uploadEncryptedFile = async (file: FileList, user:ethers.providers.JsonRpcSigner) => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    try {
      // This signature is used for authentication with encryption nodes
      // If you want to avoid signatures on every upload refer to JWT part of encryption authentication section
      const encryptionAuth = await signAuthMessage(user);
      if (!encryptionAuth) {
        console.error("Failed to sign the message.");
        return;
      }

      const { signature, signerAddress } = encryptionAuth;

      // Upload file with encryption
      const output = await lighthouse.uploadEncrypted(
        file,
        apiKey,
        signerAddress,
        signature
      );
      console.log("Encrypted File Status:", output);
      console.log(
        `Decrypt at https://decrypt.mesh3.network/evm/${output.data[0].Hash}`
      );
      return output.data[0].Hash;
    } catch (error) {
      console.error("Error uploading encrypted file:", error);
    }
  };

  const apiKey = await generateApiKey(user);

  // Upload the game to the Lighthouse network
  const cid: string = (await uploadEncryptedFile(game, user))!;
  console.log("CID:", cid);

  await addAccessCondition(cid, user, contract);

  // // Call publishGame function from the contract

  const publish = await contract.publishGame(
    cid,
    name,
    symbol,
    price,
    imageUrl,
    {gasLimit:5000000}
  );
  const reciept = await publish.wait();
  console.log("Reciept", reciept);
  // console.log("Publish Game:", publish);

  console.log("Game published successfully");
};

/**
 * Retrieves and decrypts a game file from Lighthouse using the provided CID.
 * @param cid - The CID of the game file.
 * @param user - The wallet of the user retrieving the game.
 * @returns The decrypted game file.
 */
export const getGame = async (
  cid: string,
  user: ethers.providers.JsonRpcSigner
): Promise<{ decryptedGame: FileList; url: string }> => {
  const encryptionSignature = async (user: ethers.providers.JsonRpcSigner) => {
    const address = await user.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message!;
    const signedMessage = await user.signMessage(messageRequested);
    return signedMessage;
  };

  const userAddress = await user.getAddress();
  const signature = await encryptionSignature(user);

  // Get the encrypted game from Lighthouse using the given CID
  const { data } = await lighthouse.fetchEncryptionKey(
    cid,
    userAddress,
    signature
  );
  const fileEncryptionKey: string = data.key!;

  console.log("File Encryption Key:", fileEncryptionKey);

  const fileType = "application/x-zip";
  // Decrypt the game using the file encryption key
  const decryptedGame = await lighthouse.decryptFile(
    cid,
    fileEncryptionKey,
    fileType
  );

  const url = URL.createObjectURL(decryptedGame);

  console.log("Decrypted Game:", decryptedGame, url);

  return { decryptedGame, url };
};

/**
 * Purchases a game by calling the buyGame function in the contract.
 * @param cid - The CID of the game to be purchased.
 * @param user - The wallet of the user purchasing the game.
 */
export const buyGame = async (
  cid: string,
  price: ethers.BigNumber,
  contract: ethers.Contract
): Promise<void> => {
  // Call buyGame function from the contract
  const res = await contract.buyGame(cid, {
    value: price.toString(),
    gasLimit: 5000000,
  });
  console.log("Game purchased successfully", res);
};

/**
 * Retrieves the list of games from the blockchain.
 * @param user - The wallet of the user retrieving the game list.
 * @returns A list of games with their details.
 */
export const getGameList = async (
  contract: ethers.Contract
): Promise<Game[]> => {
  console.log("contract", contract);
  // Call getGames function from the contract
  const games: Game[] = await contract.getGames({ gasLimit: 1398008 });

  console.log("Games", games);

  // Map and return the list of games
  return games.map((game: any) => ({
    cid: game.cid,
    name: game.name,
    imageUrl: game.imageUrl,
    price: game.price,
    token: game.token,
    creator: game.creator
  }));
};

//if intergarated with thirdweb, use this


/**
 * Checks if a game has been purchased by the user.
 * @param cid - The CID of the game.
 * @param user - The wallet of the user.
 * @returns A boolean indicating whether the game has been purchased.
 */
export const isGamePurchased = async (
  cid: string,
  contract: ethers.Contract
): Promise<boolean> => {
  
  console.log("contract", contract);
  // Call isGameOwned function from the contract
  const isOwned = await contract.isGameOwned([cid], {
    gasLimit: 5000000000,
  });

  return isOwned;
};
