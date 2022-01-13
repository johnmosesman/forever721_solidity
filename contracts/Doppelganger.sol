//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "utils/base64.sol";

contract Doppelganger is ERC721Enumerable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Doppelganger", "DOPP") {}

  function mint(address wallet, string memory aTokenURI) public returns(uint256) {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();

    _mint(wallet, newItemId);
    _setTokenURI(newItemId, aTokenURI);

    return newItemId;
  }

  function tokenURI(uint256 tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
    super.tokenURI(tokenId);
  }

  function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
    super.supportsInterface(interfaceId);
  }
}
