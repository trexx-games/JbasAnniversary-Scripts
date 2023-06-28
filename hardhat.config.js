require("@nomiclabs/hardhat-waffle");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.0" },
      { version: "0.8.4" },
      { version: "0.8.11" }
    ]
  },
  networks: {
    ethereum: {
      url: "https://eth-mainnet.alchemyapi.io/v2/EmmiHBSqIqQToUwMplnJ_dO3pWp9N_hl",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  }
};
