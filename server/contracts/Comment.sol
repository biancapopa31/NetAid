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

    CommentType[] public comments;
    uint256 public nextCommentId;

    // Mapping to link comments to posts
    mapping(uint256 => uint256[]) private postComments;

    event CommentCreated(CommentType _comment);
    event CommentCreated(uint256 id, string text, uint256 timestamp, address creator);

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
        CommentType memory newComment = CommentType({
            id: nextCommentId,
            text: text,
            timestamp: block.timestamp,
            creator: msg.sender
        });

        comments.push(newComment);
        emit CommentCreated(newComment);
        emit CommentCreated(nextCommentId, text, block.timestamp, msg.sender);
        nextCommentId++;
        return newComment.id;
    }

    // Get all comments for a specific post
    function getCommentsForPost(uint256 postId) public view returns (CommentType[] memory) 
    {
        // This is a placeholder function. You need to implement the logic to filter comments by postId.
        return comments;
    }
    
    // Retrieve comment details
    function getComment(uint256 commentId) public view 
        returns (CommentType memory) 
    {
        require(commentId < nextCommentId, "Comment does not exist");
        return comments[commentId];
    }

    function getNextContentId() public view returns (uint256) {
        return nextContentId;
    }
}
