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
      url: "https://polygon-mumbai.g.alchemy.com/v2/vz4Pf5QO75vldhGyzQMZDJ8fORQOnEVI",
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    hardhat: {
      ledgerAccounts: [
        "0xa809931e3b38059adae9bc5455bc567d0509ab92"
      ],
    },
  }
};
