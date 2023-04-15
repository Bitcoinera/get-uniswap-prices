const { ethers } = require("ethers");
const { uniswapV2Factory } = require("./helpers");

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
  const uniswapV2 = await uniswapV2Factory(
    { symbol: inputTokenSymbol, address: inputTokenAddress },
    { symbol: outputTokenSymbol, address: outputTokenAddress }
  );
  const price = await uniswapV2.getPrice();
  console.log(price, "ETH");
}

getPrice(args);