const { version } = require('chai');

/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("@nomiclabs/hardhat-ethers");
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const SEP_PRIVATE_KEY = process.env.SEP_PRIVATE_KEY;
const SEP_URL = process.env.SEP_URL;
const ETHSCAN_API_KEY = process.env.ETHSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const MAINNET_RPC = process.env.MAINNET_RPC;



module.exports = {
  solidity: {
    compilers: [
        {
          version: "0.8.7",
        },
        {
          version:"0.6.0"
        },
        {
          version: "0.4.24",
        },
        {
           version:"0.8.4",
        },
        {
           version:"0.8.20"
        },
        {
          version:"0.8.19",
        },
        {
          version:"0.4.19"
        },
    ],
},
  defaultNetwork:"hardhat",
  networks:{
    hardhat:{
      chainId:31337,
      forking: {
        url:MAINNET_RPC,
      }
    },
   
    localhost:{
        url:"http://127.0.0.1:8545/",
        chainId:31337,
        blockConfirmations:1,
    },

    sepolia:{
        url:SEP_URL,
        accounts:[SEP_PRIVATE_KEY],
        blockConfirmations:6,
    }
  },
  
  etherscan: {
    apiKey: ETHSCAN_API_KEY,
    customChains:[],

  },

  namedAccounts: {
    deployer: {
        default: 0,
    },
    player:{
      default:1,
    }
  },
  gasReporter:{
    enabled:false,
    outputFile:"gas-report.txt",
    // token:"ETH",
    noColors:true
  },
  mocha:{
    timeout: 500000
  }
}

