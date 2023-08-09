const { ethers } = require('hardhat');
const { LedgerSigner } = require('@anders-t/ethers-ledger');
const dotenv = require('dotenv');
dotenv.config();

const contractAddress = "0x33CE2cD509330586aD747D536a0D59A302c3053d";
const contractABI = [
  'function mint(address recipient, uint8 numGenerations, uint256 rewardRatio, uint256 ORatio, uint8 license, string tokenURI) public returns (uint256 tokenId)'
];

async function main() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, Number(process.env.POLYGON_CHAIN_ID));
    const signer  = new LedgerSigner(provider);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const parameters = {
      'recipient': "0xAfFf614668b08Bf97c10817a74fBdF8B7d958Df1",
      'numGenerations': '10',
      'rewardRatio': '350000000000000000',
      'ORatio': '300000000000000000',
      'license': '5',
      'tokenURI': 'ipfs://'
    };
    //todo: get the gas price from 
    const overrides = { maxPriorityFeePerGas: ethers.utils.parseUnits('65', 'gwei'), maxFeePerGas: ethers.utils.parseUnits('175', 'gwei')};
    const tx = await contract.mint(...Object.values(parameters), overrides);
    console.log(tx);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();