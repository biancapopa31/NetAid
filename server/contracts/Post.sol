// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ContentBase.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./UserProfile.sol";

contract Post is ContentBase, ERC721Enumerable {
    event PostCreated(address indexed creator, uint256 indexed postId, string contentURI);

    constructor() ERC721("DecentralizedPost", "DPOST") {}

    function createPost(string memory contentURI) public notEmptyURI(contentURI) returns (uint256) {
        uint256 postId = _createContent(contentURI);

        // Mint an NFT for the post
        _mint(msg.sender, postId);

        emit PostCreated(msg.sender, postId, contentURI);
        return postId;
    }

    function getPost(uint256 postId) public view returns (uint256 , string memory, address, uint256 ) {
        Content memory c = getContent(postId);
        return (postId, c.contentURI, c.creator, c.timestamp);
    }

    function getAllPosts() public view returns ( uint256[] memory, string[] memory, address[] memory, uint256[] memory) {

        uint256 postCount = nextContentId;
        uint256[] memory postIds = new uint256[](postCount);
        string[] memory contentURIs = new string[](postCount);
        address[] memory creators = new address[](postCount);
        uint256[] memory timestamps = new uint256[](postCount);

        for (uint256 i = 0; i < postCount; i++) {
            Content memory c = getContent(i);
            postIds[i] = c.id;
            contentURIs[i] = c.contentURI;
            creators[i] = c.creator; 
            timestamps[i] = c.timestamp;
        }
        return (postIds, contentURIs, creators, timestamps);
    }

    function getUserPosts(address userAddress) public view returns (uint256[] memory, string[] memory, address[] memory, uint256[] memory) {
        uint256 postCount = nextContentId;
        uint256[] memory postIds = new uint256[](postCount);
        string[] memory contentURIs = new string[](postCount);
        address[] memory creators = new address[](postCount);
        uint256[] memory timestamps = new uint256[](postCount);

        uint256 count = 0;
        for (uint256 i = 0; i < postCount; i++) {
            Content memory c = getContent(i);
            if (c.creator == userAddress) {
                postIds[i] = c.id;
                contentURIs[i] = c.contentURI;
                creators[i] = c.creator; 
                timestamps[i] = c.timestamp;    
                count++;
            }
        }

        assembly {
            mstore(postIds, count)
            mstore(contentURIs, count)
            mstore(timestamps, count)
        }

        return (postIds, contentURIs, creators, timestamps);
    }

    
}

