const fs = require('fs');
const csv = require('csv-parser');

const dotenv = require('dotenv');
dotenv.config();
const contractAddress = '0xE9a66f7c67878cFC79453F4E65b39e98De934D5a';
const contractABI = [
  'function safeTransferFrom(address from, address to, uint256 tokenId) public payable'
];

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  let tokenId = 90;
  const rows = [];

  fs.createReadStream('jbas-holders.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await rows.push(row.address);
    })
    .on('end', async () => {
      for (const row of rows) {
        const tx = await contract.safeTransferFrom(process.env.WALLET_ADDRESS, row, tokenId);
        console.log(tx);
        tokenId++;
      }
    });
}

main();