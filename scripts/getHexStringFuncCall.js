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
  const abi = [{
    'constant': false,
    'inputs': [
      {
        'name': 'recipient',
        'type': 'address'
      },
      {
        'name': 'numGenerations',
        'type': 'uint8'
      },
      {
        'name': 'rewardRatio',
        'type': 'uint256'
      },
      {
        'name': 'ORatio',
        'type': 'uint256'
      },
      {
        'name': 'license',
        'type': 'uint8'
      },
      {
        'name': 'tokenURI',
        'type': 'string'
      }
    ],
    'name': 'mint',
    'outputs': [
      {
        'name': 'tokenId',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  }];

  const parameters = {
    'recipient': '0x64b6d0df31a5435fca0f00cf210e909b2d91c603',
    'numGenerations': '10',
    'rewardRatio': '500000000000000000',
    'ORatio': '400000000000000000',
    'license': '5',
    'tokenURI': 'https://ipfs.io/ipfs/QmWbhsKD9UzU9vmB9yPuQj2x3Dut25GoQbqMiDf7Zs9NL5?filename=test_3.txt'
  };

  const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(abi[0], Object.values(parameters));
  const dfnsClient = initDfnsClient();
  const tx = await dfnsClient.wallets.getWalletHistory({
    walletId: process.env.DNFS_WALLET_ID,
  })
  console.log(tx);
  const tx2 = await dfnsClient.wallets.broadcastTransaction({
    walletId: process.env.DNFS_WALLET_ID,
    body: {
      to: "0xE9a66f7c67878cFC79453F4E65b39e98De934D5a",
      kind: "Evm",
      data: encodedFunctionCall,
    }
  })
  console.log(tx2);
}

main();