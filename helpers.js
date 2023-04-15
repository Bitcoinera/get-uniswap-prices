const axios = require("axios");
const { ethers } = require("ethers");
const {
  ChainId,
  Fetcher,
  Route,
  Trade,
  TradeType,
  TokenAmount,
  WETH,
} = require("@uniswap/sdk");
require("dotenv").config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);

const uniswapV2Factory = async (token1, token2) => {
  return {
    getPrice: async () => {
      const t1 = await Fetcher.fetchTokenData(
        ChainId.MAINNET,
        token1.address,
        provider
      );
      const t2 = await Fetcher.fetchTokenData(
        ChainId.MAINNET,
        token2.address,
        provider
      );
      try {
        const pair = await Fetcher.fetchPairData(t1, t2);
        const route = new Route([pair], t1);
        const midverse = route.midPrice.invert().toSignificant(6);

        // execution price
        // const trade = new Trade(
        //   route,
        //   new TokenAmount(WETH[ChainId.MAINNET], "1000000000000000000"),
        //   TradeType.EXACT_INPUT
        // );
        // console.log(
        //   "Execution price is",
        //   trade.executionPrice.invert().toSignificant(6)
        // );

        return midverse;
      } catch (e) {
        // some reverts without a reason, so we will simply retry each time in this case
        console.log("retry");
        await uniswapV2Factory(token1, token2);
      }
    },
  };
};

const getAbi = async (address) => {
  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
  const res = await axios.get(url);
  const abi = JSON.parse(res.data.result);
  return abi;
};

const getPoolImmutables = async (poolContract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);

  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee,
  };

  return immutables;
};

module.exports = {
  getAbi,
  getPoolImmutables,
  uniswapV2Factory,
};
