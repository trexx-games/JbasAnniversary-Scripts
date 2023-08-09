const { ethers } = require('hardhat');
// const { LedgerSigner } = require('@anders-t/ethers-ledger');	
const { LedgerSigner } = require('@ethers-ext/signer-ledger');
const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid").default;
const dotenv = require('dotenv');
dotenv.config();

const contractAddress = "0x33CE2cD509330586aD747D536a0D59A302c3053d";
const contractABI = [
  'function mint(address recipient, uint8 numGenerations, uint256 rewardRatio, uint256 ORatio, uint8 license, string tokenURI) public returns (uint256 tokenId)'
];

async function main() {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, Number(process.env.POLYGON_CHAIN_ID));
    const transport = await TransportNodeHid.open();
    const ledgerSigner  = new LedgerSigner(transport);
    const signer = ledgerSigner.connect(provider);

    // const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const parameters = {
      'recipient': "0x64B6D0Df31a5435fca0F00cf210E909b2d91c603",
      'numGenerations': '10',
      'rewardRatio': '350000000000000000',
      'ORatio': '300000000000000000',
      'license': '5',
      'tokenURI': 'ipfs://QmPaXY75MvYizibTnAuZ3ZFRBAKBVHkZXSc3ZKttVziKw6'
    };
    const tx = await contract.mint(...Object.values(parameters));
    console.log(tx);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

main();