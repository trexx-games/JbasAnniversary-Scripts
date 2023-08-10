const mintFunctionAbi = [
  'function mint(address recipient, uint8 numGenerations, uint256 rewardRatio, uint256 ORatio, uint8 license, string tokenURI) public returns (uint256 tokenId)'
];

const transferFunctionAbi = [
  'function safeTransferFrom(address from, address to, uint256 tokenId) public payable'
];

module.exports = {
  mintFunctionAbi,
  transferFunctionAbi
}
