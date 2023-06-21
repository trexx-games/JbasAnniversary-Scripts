const { Alchemy, Network } = require("alchemy-sdk");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const dotenv = require("dotenv");
dotenv.config();

const config = {
  apiKey: process.env.ALCHEMY_SDK_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const main = async () => {
  const address = "0x2120D19431E0Dd49411E5412629f8e41A72CfABD";
  const owners = await alchemy.nft.getOwnersForContract(address);
  const csvWriter = createCsvWriter({
    path: 'jbas-holders.csv',
    header: [
      { id: 'holder', title: 'JBAS Holder' },
    ],
  });

  const records = owners.owners.map((holder) => ({ holder }));
  await csvWriter.writeRecords(records);
};

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