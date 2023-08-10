require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-ledger");
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
    mumbai: {
      url: `${process.env.ALCHEMY_API_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    hardhat: {
      ledgerAccounts: [
        `${process.env.JBAS_WALLET_ADDRESS}`
      ],
    },
  }
};