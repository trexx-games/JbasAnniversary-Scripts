const { ethers } = require('hardhat');
const { LedgerSigner } = require('@anders-t/ethers-ledger');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();


const init = async () => {
  const contractAddress = process.env.UNTRADING_CONTRACT_ADDRESS;
  const abi = require('../contracts/unFacetABI.json');
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, Number(process.env.POLYGON_CHAIN_ID));
  const signer = new LedgerSigner(provider);
  // const [signer] = await ethers.getSigners();
  Contract = new ethers.Contract(contractAddress, abi, signer);
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

  for (let i = 0; i <= 20; i++) {
    try {
        //run only one time for efficiency
        // const cid = await uploadMetadata(); 
        const tokenURI = "ipfs://bafkreid6574qevq76qwcs7dzw3bla4gkwd3pgpjg4phl2pq2bchbl2rc6q";
        const gasEstimate = await fetch('https://gasstation.polygon.technology/v2');
        const gasEstimateJson = await gasEstimate.json();
        const overrides = { 
          maxPriorityFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.standard.maxPriorityFee), 'gwei'), 
          maxFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.standard.maxFee), 'gwei')
        };
        const tx = await Contract.mint(...Object.values(parameters), tokenURI, overrides);
        // const tx = await Contract.mint(...Object.values(parameters), tokenURI);
        const receipt = await tx.wait()
        console.log(receipt.logs)
        let tokenID = parseInt(BigInt(receipt.logs[0].topics[1]).toString());
        console.log("minted token #" + tokenID);
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
  await mint();
}

main();
