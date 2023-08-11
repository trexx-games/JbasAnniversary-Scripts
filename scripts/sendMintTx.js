const { ethers } = require('hardhat');
const csv = require('@fast-csv/parse');
const { LedgerSigner } = require('@anders-t/ethers-ledger');
const { NFTStorage } = require('nft.storage')
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

let holdersAddressData = new Array();
let Contract;
const storageClient = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });

async function readFile() {
  var stream = fs.createReadStream(__dirname + '/../data/jbas-holders.csv');

  csv.parseStream(stream)
      .on('error', error => {
          console.log(error);
      })
      .on('data', row => {
          let isAddress = ethers.utils.isAddress(row[0]);
          if (isAddress && row[0] != null && row[0] != '') {
              holdersAddressData.push(row[0]);
          }
      })
      .on('end', _ => {
        mint();
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

const uploadMetadata = async () => {
  let data = {
      blockchain: process.env.BLOCKCHAIN_NAME,
      department: "Collectible",
      description: "Merch Temple",
      image: "ipfs://" + process.env.VIDEO_IPFS_CID,
      license: "CBE-NECR",
      externalUrl: "https://www.japanesebornapesociety.com/",
      media: {
          cid: process.env.VIDEO_IPFS_CID,
          dimensions: "1080x1080",
          duration: 5000,
          mimeType: "video/mp4",
          size: 31040256,
          url: "https://ipfs.io/ipfs/" + process.env.VIDEO_IPFS_CID
      },
      name: "JBAS Merch Temple (JBAST)",
      numberOfGenerations: 10,
      originator: process.env.JBAS_WALLET_ADDRESS,
      originatorRewardRatio: 30,
      sensitiveContent: false,
      timestamp: Date.now(),
      totalRewardRatio: 35
  }
  const metadata = await storageClient.storeBlob(new Blob([JSON.stringify(data)]));
  return metadata
}


async function mint() {
  console.log('...NFT MINT STARTED...');
  const parameters = {
    recipient: process.env.JBAS_WALLET_ADDRESS,
    numGenerations: 10,
    rewardRatio: ethers.utils.parseUnits("0.35", "ether"),
    ORatio: ethers.utils.parseUnits("0.30", "ether"),
    license: 2,
  }
  const writeStream = fs.createWriteStream(__dirname + "/../logs/mint_transactions.csv", { flags: 'a' });

  for (let i = 0; i < holdersAddressData.length; i++) {
    try {
        const cid = await uploadMetadata(); 
        const tokenURI = "ipfs://" + cid;
        const gasEstimate = await fetch('https://gasstation.polygon.technology/v2');
        const gasEstimateJson = await gasEstimate.json();
        const overrides = { 
          maxPriorityFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.standard.maxPriorityFee), 'gwei'), 
          maxFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.standard.maxFee), 'gwei')
        };
        // const tx = await Contract.mint(...Object.values(parameters), tokenURI, overrides);
        const tx = await Contract.mint(...Object.values(parameters), tokenURI);
        const receipt = await tx.wait()
        console.log(receipt.logs)
        let tokenID = parseInt(BigInt(receipt.logs[0].topics[1]).toString());
        console.log("minted token #" + tokenID);
        writeStream.write([holdersAddressData[i], tokenID, tx.hash].join(',') + '\n');
        console.log('------------------------');
    } catch (error) {
      console.error('An error occurred:', error);
      writeStream.end();
    }
  }
  writeStream.end()
  writeStream.on('finish', () => {
    console.log('Mint finished done.')
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
