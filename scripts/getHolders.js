const { ethers } = require("hardhat");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dotenv = require("dotenv");
dotenv.config();

const contractAddress = '0x2120D19431E0Dd49411E5412629f8e41A72CfABD';

const csvWriter = createCsvWriter({
  path: 'jbas-holders.csv',
  header: [
    { id: 'holder', title: 'JBAS Holder' },
  ],
});

async function getMinters() {
  const provider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);
  const contract = await new ethers.Contract(contractAddress, ['event Presale(address indexed user, uint256 amount)'], provider);

  const firstPreSale = 14819450;
  const blockAfterTwoHours = await provider.getBlockWithTransactions(14819956);
  const filter = contract.filters.Presale();
  const logs = await provider.getLogs({
    fromBlock: firstPreSale,
    toBlock: blockAfterTwoHours.number,
    address: contractAddress,
    topics: filter.topics
  });

  const minters = logs
    .map((log) => {
      const event = contract.interface.parseLog(log);
      return event.args.user;
    });

  return [...new Set(minters)];
}

// async function checkHolders(minters) {
//   const provider = new ethers.providers.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);
//   const contract = new ethers.Contract(contractAddress, ['function balanceOf(address owner) external view returns (uint256)'], provider);

//   const holders = [];
//   for (const minter of minters) {
//     const balance = await contract.balanceOf(minter);
//     if (balance.gt(0)) {
//       holders.push(minter);
//     }
//   }

//   return holders;
// }

async function main() {
  const minters = await getMinters();
  // const holders = await checkHolders(minters);
  const records = minters.map((holder) => ({ holder }));
  await csvWriter.writeRecords(records);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();