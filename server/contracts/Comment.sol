// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ContentBase.sol";
import "./Post.sol";

/*E facut cu gettere*/

contract Comment is ContentBase {

    // Mapping to link comments to posts
    mapping(uint256 => uint256[]) private postComments;


    event CommentCreated(address indexed creator, uint256 indexed commentId, string contentURI);

    /* FUNCTIONS */

     function test() public pure returns(string memory){
        return "This is a test from Comment contract";
    }

    // Create a new comment for a specific post
    function createComment(string memory contentURI, uint256 postId) public notEmptyURI(contentURI) returns (uint256) {
        uint256 commentId = _createContent(contentURI);
        postComments[postId].push(commentId);

        emit CommentCreated(msg.sender, commentId, contentURI);
        return commentId;
    }

    // Get all comments for a specific post
    function getCommentsForPost(uint256 postId) public view returns (uint256[] memory, string[] memory, address[] memory, uint256[] memory) 
    {
        uint256 commentCount = postComments[postId].length;
        require( commentCount> 0, "No comments for this post");

        uint256[] memory commentIds = new uint256[](commentCount);
        string[] memory contentURIs = new string[](commentCount);
        address[] memory creators = new address[](commentCount);
        uint256[] memory timestamps = new uint256[](commentCount);

        for (uint256 i = 0; i < commentCount; i++) {
            Content memory c = getContent(postComments[postId][i]);
            commentIds[i] = c.id;
            contentURIs[i] = c.contentURI;
            creators[i] = c.creator; 
            timestamps[i] = c.timestamp;
        }
        return (commentIds, contentURIs, creators, timestamps);
    }
    
    // Retrieve comment details
    function getComment(uint256 commentId) public view 
        returns (uint256, string memory, address, uint256) 
    {
        Content memory c = getContent(commentId);
        return (commentId, c.contentURI, c.creator, c.timestamp);
    }

    function getNextContentId() public view returns (uint256) {
        return nextContentId;
    }
}
