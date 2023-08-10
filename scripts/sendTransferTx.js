const fs = require('fs');
const csv = require('csv-parser');
const { LedgerSigner } = require('@anders-t/ethers-ledger');
const { transferFunctionAbi } = require('./abi');
const dotenv = require('dotenv');
dotenv.config();
const contractAddress = process.env.UNTRADING_CONTRACT_ADDRESS;


async function main() {
    console.log('...AIR DROP STARTED...')

  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL, Number(process.env.POLYGON_CHAIN_ID));
  const signer  = new LedgerSigner(provider);
  const contract = new ethers.Contract(contractAddress, transferFunctionAbi, signer);

  let tokenId = 90;
  //getAllTokensNumbersofSome Wallet
  const rows = [];

  fs.createReadStream('jbas-holders.csv')
    .pipe(csv())
    .on('data', async (row) => {
      await rows.push(row.address);
    })
    .on('end', async () => {
      for (const row of rows) {
        const tx = await contract.safeTransferFrom(process.env.JBAS_WALLET_ADDRESS, row, tokenId);
        fs.appendFileSync('transfer_transactions_hash.csv', `${tx.hash}\n`);
        console.log(`NFT #${tokenId} SENT: ${tx.hash}`);
        tokenId++;
      }
    });
}

main();