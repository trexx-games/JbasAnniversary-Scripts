const fs = require('fs');
const csv = require('@fast-csv/parse');
const { ethers } = require('hardhat');
const { LedgerSigner } = require('@anders-t/ethers-ledger');
const dotenv = require('dotenv');
dotenv.config();


let holdersAddressData = new Array();
let Contract;

async function readFile() {
  var stream = fs.createReadStream(__dirname + '/../logs/mint_transactions.csv');

  csv.parseStream(stream)
      .on('error', error => {
          console.log(error);
      })
      .on('data', row => {
          let isAddress = ethers.utils.isAddress(row[0]);
          if (isAddress && row[0] != null && row[0] != '') {
              holdersAddressData.push(row);
          }
      })
      .on('end', _ => {
        airDrop();
      });
}

const init = async () => {
  const contractAddress = process.env.UNTRADING_CONTRACT_ADDRESS;
  const abi = require('../contracts/unFacetABI.json');
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, Number(process.env.POLYGON_CHAIN_ID));
  // const signer = new LedgerSigner(provider);
  const [signer] = await ethers.getSigners();
  Contract = new ethers.Contract(contractAddress, abi, signer);
}

const airDrop = async () => {
  console.log('...AIR DROP STARTED...')
  const writeStream = fs.createWriteStream(__dirname + '/../logs/transfer_transactions.csv');
  for (let i = 0; i < holdersAddressData.length; i++) {
    try {
      let holder = holdersAddressData[i];
      let recipient = holder[0];
      let tokenId = holder[1];
      console.log(`Transfering TokenID ${tokenId} to ${recipient}`);
      const gasEstimate = await fetch('https://gasstation.polygon.technology/v2');
      const gasEstimateJson = await gasEstimate.json();
      const overrides = {
          maxPriorityFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.fast.maxPriorityFee), 'gwei'),
          maxFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.fast.maxFee), 'gwei')
      };
      // const tx = await Contract.transferFrom(process.env.JBAS_WALLET_ADDRESS, recipient, tokenId);
      const tx = await Contract.transferFrom(process.env.JBAS_WALLET_ADDRESS, recipient, tokenId, overrides);
      console.log(`Transfer ${tokenId} succeed #`);
      writeStream.write([recipient, tokenId, tx.hash].join(',') + '\n');
      console.log('------------------------');
    } catch (error) {
      console.log(error);
      writeStream.end();
    }
  }
  
  writeStream.on('finish', () => {
    console.log('AirDrop Done.')
  }).on('error', (err) => {
      console.log(err)
  })

  return;
}

const main = async () => {
  await init();
  readFile();
}

main();