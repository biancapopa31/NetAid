// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// contract PostNFT is ERC721URIStorage, Ownable {
//     uint256 private _tokenIdCounter;

//     constructor() ERC721("PostNFT", "PNFT") {}

//     // Mint a new NFT representing a post
//     function createPost(address to, string memory metadataURI) public onlyOwner {
//         uint256 newTokenId = _tokenIdCounter;
//         _safeMint(to, newTokenId);
//         _setTokenURI(newTokenId, metadataURI);
//         _tokenIdCounter++;
//     }
// }
