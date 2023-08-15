const fs = require('fs');
const csv = require('@fast-csv/parse');
const path = require('path');

let holdersAddressData = [];
let startingTokenId = 1587;
const startingAddress = '0xfD041bcFe1dAc7955f1053BEEDE963C4Bee04227';
const mintTransactionsPath = path.join(__dirname, '/../logs/mint_transactions.csv');
const holdersPath = path.join(__dirname, '/../data/jbas-holders.csv');

async function readHoldersFile() {
  return new Promise((resolve, reject) => {
      fs.createReadStream(holdersPath)
          .pipe(csv.parse({ headers: false }))
          .on('error', error => reject(error))
          .on('data', row => {
              let address = row[0];
              if (address === startingAddress) {
                  foundStartingAddress = true;
              } else if (foundStartingAddress) {
                  holdersAddressData.push(address);
              }
          })
          .on('end', _ => resolve());
  });
}

async function updateMintTransactions() {
  const writeStream = fs.createWriteStream(mintTransactionsPath, { flags: 'a' });

  for (let address of holdersAddressData) {
      const txHash = "0x" + Math.random().toString(16).substr(2, 64); 
      writeStream.write([address, startingTokenId, txHash].join(',') + '\n');
      console.log(`Added TokenID ${startingTokenId} for address ${address}`);
      startingTokenId++;
  }

  writeStream.end();
}

async function main() {
    await readHoldersFile();
    await updateMintTransactions();
    console.log('Update completed.');
}

main();
