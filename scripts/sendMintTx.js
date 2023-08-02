const { ethers } = require('hardhat');
const { LedgerSigner } = require('@ethersproject/hardware-wallets');
const dotenv = require('dotenv');
dotenv.config();

const contractAddress = "0xE9a66f7c67878cFC79453F4E65b39e98De934D5a";
const contractABI = [
  'function mint(address recipient, uint8 numGenerations, uint256 rewardRatio, uint256 ORatio, uint8 license, string tokenURI) public returns (uint256 tokenId)'
];

async function main() {
  try {
    const provider = new ethers.getDefaultProvider("https://polygon-mumbai.g.alchemy.com/v2/vz4Pf5QO75vldhGyzQMZDJ8fORQOnEVI", {
     alchemy: process.env.ALCHEMY_SDK_API_KEY
    });
    const signer = new LedgerSigner(provider);
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
