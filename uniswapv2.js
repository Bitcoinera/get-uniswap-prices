const { ethers } = require("ethers");
const { fetchEthPrice, getUniswapV2Price } = require("./helpers");

const args = {
  inputTokenAddress: ethers.utils.getAddress(
    "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  ),
  inputTokenSymbol: "ETH",
  outputTokenAddress: ethers.utils.getAddress(
    "0x09f8c130b27ee844af77cf05cffa569febac819e"
  ),
  outputTokenSymbol: "LAURA",
};

async function getPrice(args) {
  const {
    inputTokenSymbol,
    inputTokenAddress,
    outputTokenSymbol,
    outputTokenAddress,
    inputAmount,
  } = args;
  const price = await getUniswapV2Price(
    { symbol: inputTokenSymbol, address: inputTokenAddress },
    { symbol: outputTokenSymbol, address: outputTokenAddress }
  );

  // TODO: deal with decimals
  console.log(price, "ETH");
  const ethPrice = await fetchEthPrice();
  console.log((price * ethPrice).toString(), "$");
  return price * ethPrice;
}

getPrice(args);
