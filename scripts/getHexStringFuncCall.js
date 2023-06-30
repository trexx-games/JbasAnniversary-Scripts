const { Web3 } = require('web3');
const web3 = new Web3();
const abi = [{
  "constant": false,
  "inputs": [
    {
      "name": "recipient",
      "type": "address"
    },
    {
      "name": "numGenerations",
      "type": "uint8"
    },
    {
      "name": "rewardRatio",
      "type": "uint256"
    },
    {
      "name": "ORatio",
      "type": "uint256"
    },
    {
      "name": "license",
      "type": "uint8"
    },
    {
      "name": "tokenURI",
      "type": "string"
    }
  ],
  "name": "mint",
  "outputs": [
    {
      "name": "tokenId",
      "type": "uint256"
    }
  ],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}];

const parameters = {
  "recipient": "0x64b6d0df31a5435fca0f00cf210e909b2d91c603",
  "numGenerations": "10",
  "rewardRatio": "500000000000000000",
  "ORatio": "400000000000000000",
  "license": "5",
  "tokenURI": "https://ipfs.io/ipfs/QmWbhsKD9UzU9vmB9yPuQj2x3Dut25GoQbqMiDf7Zs9NL5?filename=test_3.txt"
};


const encodedFunctionCall = web3.eth.abi.encodeFunctionCall(abi[0], Object.values(parameters));
console.log(Object.values(parameters));
console.log(encodedFunctionCall);