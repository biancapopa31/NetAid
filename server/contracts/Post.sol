// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ContentBase.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./UserProfile.sol";

contract Post is ContentBase, ERC721Enumerable {
    event PostCreated(address indexed creator, uint256 indexed postId, string text, string photoCid);

    constructor() ERC721("DecentralizedPost", "DPOST") {}

    function test() public pure returns(string memory){
        return "This is a test from Post contract";
    }

    function createPost(string memory text, string memory photoCid) public notEmpty(text, photoCid) returns (uint256) {
        uint256 postId = createContent(text, photoCid);

        // Mint an NFT for the post
        _mint(msg.sender, postId);

        emit PostCreated(msg.sender, postId, text, photoCid);
        return postId;
    }

    function getPost(uint256 postId) public view returns (uint256 , string memory, string memory, address, uint256 ) {
        Content memory c = getContent(postId);
        return (postId, c.text, c.photoCid, c.creator, c.timestamp);
    }

    function getAllPosts() public view returns ( uint256[] memory, string[] memory, address[] memory, uint256[] memory) {

        uint256 postCount = nextContentId;
        uint256[] memory postIds = new uint256[](postCount);
        string[] memory texts = new string[](postCount);
        string[] memory photoCids = new string[](postCount);
        address[] memory creators = new address[](postCount);
        uint256[] memory timestamps = new uint256[](postCount);

        for (uint256 i = 0; i < postCount; i++) {
            Content memory c = getContent(i);
            postIds[i] = c.id;
            texts[i] = c.text;
            photoCids[i] = c.photoCid;
            creators[i] = c.creator; 
            timestamps[i] = c.timestamp;
        }
        return (postIds, texts, creators, timestamps);
    }

    function getUserPosts(address userAddress) public view returns (uint256[] memory, string[] memory, string[] memory, address[] memory, uint256[] memory) {
        uint256 postCount = nextContentId;
        uint256[] memory postIds = new uint256[](postCount);
        string[] memory texts = new string[](postCount);
        string[] memory photoCids = new string[](postCount);
        address[] memory creators = new address[](postCount);
        uint256[] memory timestamps = new uint256[](postCount);

        uint256 count = 0;
        for (uint256 i = 0; i < postCount; i++) {
            Content memory c = getContent(i);
            if (c.creator == userAddress) {
                postIds[i] = c.id;
                texts[i] = c.text;
                photoCids[i] = c.photoCid;
                creators[i] = c.creator; 
                timestamps[i] = c.timestamp;    
                count++;
            }
        }

        assembly {
            mstore(postIds, count)
            mstore(texts, count)
            mstore(timestamps, count)
        }

        return (postIds, texts, photoCids, creators, timestamps);
    }

    
}

