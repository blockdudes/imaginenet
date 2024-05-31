import { defineChain,} from "thirdweb/chains";

export const calibration_testnet = defineChain({
  id: 0x4cb2f,
  name: "Filecoin - Calibration testnet",
  rpc: 'https://filecoin-calibration.chainup.net/rpc/v1',

  nativeCurrency: {
    symbol: 'tFIL',
    decimals: 18,
  },
  slug: "Filecoin - Calibration testnet",
});

// export const fileCoin_testnet = defineChain({
//   id: 0x1,
//   name: "filecoin",
//   rpc: 'https://virtual.mainnet.rpc.tenderly.co/2eec2500-1e99-43a3-825a-8deeda67c1fe',

//   nativeCurrency: {
//     symbol: 'ETH',
//     decimals: 18,
//   },
//   slug: "filecoin",
// });

