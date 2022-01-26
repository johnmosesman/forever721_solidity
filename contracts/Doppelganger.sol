//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//import "utils/base64.sol";

contract Doppelganger is ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Snapshot {
<<<<<<< Updated upstream
        address snapshotMinter;
=======
>>>>>>> Stashed changes
        address originalTokenAddress;
        uint256 originalTokenId;
    }

    mapping(uint256 => Snapshot) public snapshots;

    constructor() ERC721("Doppelganger", "DOPP") {}

    function snapshot(address tokenContractAddress, uint256 originalTokenId, string newTokenURI)
        public
        returns (uint256)
    {
        IERC721 erc721 = IERC721(tokenContractAddress);

        // Only owner of NFT can mint snapshot
        address ownerAddress = erc721.ownerOf(originalTokenId);
        require(
            msg.sender == ownerAddress,
            "Doppelganger: only owner of original token can snapshot."
        );

        uint256 snapshotTokenId = _mintSnapshot(newTokenURI);

        Snapshot memory newSnapshot = Snapshot({
            snapshotMinter: msg.sender,
            originalTokenAddress: tokenContractAddress,
            originalTokenId: originalTokenId
        });
        snapshots[snapshotTokenId] = newSnapshot;

        return snapshotTokenId;
    }

    function _mintSnapshot(string memory aTokenURI) private returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, aTokenURI);

        return newItemId;
    }

    // Overrides

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
