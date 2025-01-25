// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ContentBase.sol";
import "./Post.sol";

/*E facut cu gettere*/


contract Comment is ContentBase {

    struct CommentType{
        uint256 id;
        string text;
        uint256 timestamp;
        address creator;
    }

    // Mapping to link comments to posts
    mapping(uint256 => uint256[]) private postComments;

    event CommentCreated(CommentType _comment);

    /* FUNCTIONS */

     function test() public pure returns(string memory){
        return "This is a test from Comment contract";
    }

    function transformContentInComment(Content memory content) internal pure virtual returns (CommentType memory comment) {
        return CommentType({
            id: content.id, 
            text: content.text,
            timestamp : content.timestamp,
            creator: content.creator
            });
    
    }

    // Create a new comment for a specific post
    function createComment(string memory text, uint256 postId) public notEmpty(text, '') returns (uint256) {
        Content memory newContent = createContent(text, '');

        CommentType memory newComment = transformContentInComment(newContent);

        postComments[postId].push(newComment.id);

        emit CommentCreated(newComment);
        return newComment.id;
    }

    // Get all comments for a specific post
    function getCommentsForPost(uint256 postId) public view returns (CommentType[] memory) 
    {
        uint256 commentCount = postComments[postId].length;
        require( commentCount> 0, "No comments for this post");

        uint256 count = 0;
        CommentType [] memory comments = new CommentType [](commentCount);

        for (uint256 i = 0; i < commentCount; i++) {
            Content memory c = getContent(postComments[postId][i]);
            comments[i] = transformContentInComment(c);
        }

        assembly{
            mstore(comments, count)
        }

        return  comments;
    }
    
    // Retrieve comment details
    function getComment(uint256 commentId) public view 
        returns (CommentType memory) 
    {
        Content memory c = getContent(commentId);

        return transformContentInComment(c);
    }

    function getNextContentId() public view returns (uint256) {
        return nextContentId;
    }
}
