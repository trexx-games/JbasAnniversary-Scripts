# NFT Holders Airdrop

This project is designed to facilitate an airdrop to the holders of a specific NFT contract. It fetches all the holders of a given NFT contract and writes their addresses to a CSV file, which can then be used to distribute tokens or other rewards.

## How it works

The script uses the Alchemy API to fetch the owners of an NFT contract. It then writes these addresses to a CSV file, with each address on a new line.

This list of addresses can then be used to perform an airdrop, i.e., to distribute tokens or other rewards to these addresses. The airdrop itself is not part of this script and would need to be performed separately, using a tool that can read the CSV file and send transactions to the Ethereum network.

## Setup

1. Install the required dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory of the project and add your Alchemy API key like so:

```
ALCHEMY_SDK_API_KEY=your_alchemy_api_key_here
```

3. Replace the `address` variable with the address of the NFT contract you're interested in.

## Usage

To run the script and generate the CSV file, use the following command:

```bash
node scripts/getHolders.js
```

