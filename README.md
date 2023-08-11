# Untrading NFT Mint and Drop Script

This script is designed to automate the NFT minting process and AirDrop to Holders of some already existing collection. 

It interacts with a smart contract and uses the NFT Storage API to store NFT metadata.

## Requirements

- Node.js (v.18)
- Hardhat
- Ledger Hardware Wallet (optional)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/trexx-games/JbasAnniversary-Scripts.git
cd [DIRECTORY_NAME]
```

2. Install the dependencies:

```bash
npm install
```

3. Configure the environment variables:

Copy the `.env.example` file to `.env` and fill in the necessary environment variables, such as the Alchemy API URL (or other provider), NFT Storage API key, contract address, and others.

## Usage

### To run the minting script:

```bash
npx hardhat run scripts/sendMintTx.js 
```

The script will automatically read holder addresses from a CSV file, upload metadata to NFT Storage, and then interact with the smart contract to mint the NFT.

### To run the transfer script:

```bash
npx hardhat run scripts/sendTransferTx.js 
```

The script will automatically read holder addresses and its Token from a CSV file and execute the transfer.

## Features

- Automatic reading of holder addresses from a CSV file.
- Metadata upload to NFT Storage.
- Interaction with the smart contract on the Polygon network.
- Automatic gas estimation using the Polygon Gas Station.
- Logging of successful transactions to a CSV file.
