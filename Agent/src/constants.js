const INST_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const DAI_ADDRESS = "";
const USDC_ADDRESS = "";
const INST_DECIMALS = 18;
const TRANSFER_EVENT =
  "event Transfer(address indexed from, address indexed to, uint value)";

const addresses = {
  dai: DAI_ADDRESS,
  usdc: USDC_ADDRESS
}

module.exports = {
  INST_ADDRESS,
  addresses,
  INST_DECIMALS,
  TRANSFER_EVENT,
};
