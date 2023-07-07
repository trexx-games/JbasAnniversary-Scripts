const fs = require('fs');
const csv = require('csv-parser');
const { Web3 } = require('web3');
const { DfnsApiClient } = require('@dfns/sdk');
const { AsymmetricKeySigner } = require('@dfns/sdk-keysigner');

const dotenv = require('dotenv');
dotenv.config();

const initDfnsClient = () => {
  const signer = new AsymmetricKeySigner({
    credId: process.env.DFNS_CRED_ID,
    privateKey: process.env.DFNS_PRIVATE_KEY,
    appOrigin: process.env.DFNS_APP_ORIGIN,
  })
  return new DfnsApiClient({
    baseUrl: process.env.DFNS_BASE_URL,
    appId: process.env.DFNS_APP_ID,
    authToken: process.env.DFNS_AUTH_TOKEN,
    signer,
  })
}

async function main() {
  const web3 = new Web3();
  const abi = {
    'constant': false,
    'inputs': [
      {
        'name': 'from',
        'type': 'address'
      },
      {
        'name': 'to',
        'type': 'address'
      },
      {
        'name': 'tokenId',
        'type': 'uint256'
      }
    ],
    'name': 'safeTransferFrom',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function'
  };

  const dfnsClient = initDfnsClient();
  let tokenId = 51;

  fs.createReadStream('jbas-holders.csv')
    .pipe(csv())
    .on('data', async (row) => {
      console.log(row.address)
      const parameters = {
        'from': '0xa0a30c8bcceed4e9781f9fb1363a620e92807fa0',
        'to': row.address,
        'tokenId': tokenId.toString()
      };

      const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(abi, Object.values(parameters));

      await dfnsClient.wallets.broadcastTransaction({
        walletId: process.env.DNFS_WALLET_ID,
        body: {
          to: "0xE9a66f7c67878cFC79453F4E65b39e98De934D5a",
          kind: "Evm",
          data: encodedFunctionCall,
        }
      });

      tokenId++;
    });
}

main();