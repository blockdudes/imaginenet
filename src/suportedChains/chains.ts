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