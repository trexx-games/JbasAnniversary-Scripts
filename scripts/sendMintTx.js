const { ethers } = require('hardhat');
const { LedgerSigner } = require('@anders-t/ethers-ledger');
const { mintFunctionAbi } = require('./abi');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

const contractAddress = process.env.UNTRADING_CONTRACT_ADDRESS;

async function main() {
  try {
    console.log('...NFT MINTING STARTED...')
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, Number(process.env.POLYGON_CHAIN_ID));
    // const signer  = new LedgerSigner(provider);
    const [signer] = await ethers.getSigners();

    const contract = new ethers.Contract(contractAddress, mintFunctionAbi, signer);
    const parameters = {
      'recipient': process.env.WALLET_ADDRESS,
      'numGenerations': '10',
      'rewardRatio': '350000000000000000',
      'ORatio': '300000000000000000',
      'license': '2',
      'tokenURI': 'ipfs://bafybeieip57f53756adpylxvbgoxwhorpmy75kplkqukcgf656j4ahcajm'
    };
    const totalNFTsToMint = Number(process.env.AMOUNT_OF_NFTS_TO_MINT);
    for (let i = 0; i < totalNFTsToMint; i++) {
      const gasEstimate = await fetch('https://gasstation.polygon.technology/v2');
      const gasEstimateJson = await gasEstimate.json();
      const overrides = { maxPriorityFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.standard.maxPriorityFee), 'gwei'), maxFeePerGas: ethers.utils.parseUnits(String(gasEstimateJson.standard.maxFee), 'gwei')};
      const tx = await contract.mint(...Object.values(parameters));
  
      fs.appendFileSync('./logs/mint_transactions_hash.csv', `${tx.hash}\n`);
      console.log(`Minted NFT #${i + 1}: ${tx.hash}`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();