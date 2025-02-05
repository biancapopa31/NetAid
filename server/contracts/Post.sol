// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ContentBase.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./UserProfile.sol";

contract Post is ContentBase, ERC721Enumerable {
    event PostCreated(Content _content);

    constructor() ERC721("DecentralizedPost", "DPOST") {}

    function test() public pure returns(string memory){
        return "This is a test from Post contract";
    }

    function createPost(string memory text, string memory photoCid) public notEmpty(text, photoCid) returns (uint256) {
        Content memory newPost = createContent(text, photoCid);

        // Mint an NFT for the post
        _mint(msg.sender, newPost.id);

        emit PostCreated(newPost);
        return newPost.id;
    }

    function getPost(uint256 postId) public view returns (uint256 , string memory, string memory, address, uint256 ) {
        Content memory c = getContent(postId);
        return (postId, c.text, c.photoCid, c.creator, c.timestamp);
    }

    function getAllPosts() public view returns ( Content[] memory) {

        return super.getAllContent();
    }

    function getUserPosts(address userAddress) public view returns (Content[] memory) {
        uint256 postCount = nextContentId;
        Content[] memory allPosts = super.getAllContent();
        Content[] memory userPosts = new Content[](postCount);

        uint256 count = 0;
        for(uint256 i = 0; i < postCount; i++){
            if (userAddress == allPosts[i].creator) {
                userPosts[count] = allPosts[i];
                count++;
            }
        }

        assembly{
            mstore(userPosts, count)
        }

        return userPosts;
        
    }

    
}

