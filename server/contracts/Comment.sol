// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./ContentBase.sol";
import "./Post.sol";

/*E facut cu gettere*/


contract Comment is ContentBase {


    DataTypes.Comment[] public comments;
    uint256 public nextCommentId;

    // Mapping to link comments to posts
    mapping(uint256 => uint256[]) private postComments;

    event CommentCreated(DataTypes.Comment);

    /* FUNCTIONS */

     function test() public pure returns(string memory){
        return "This is a test from Comment contract";
    }

    function transformContentInComment(Content memory content) internal pure virtual returns (DataTypes.Comment memory comment) {
        return DataTypes.Comment({
            id: content.id, 
            text: content.text,
            timestamp : content.timestamp,
            creator: content.creator
            });
    
    }

    // Create a new comment for a specific post
    function createComment(string memory text, uint256 postId) public notEmpty(text, '') returns (uint256) {
        DataTypes.Comment memory newComment = DataTypes.Comment({
            id: nextCommentId,
            text: text,
            timestamp: block.timestamp,
            creator: msg.sender
        });

        comments.push(newComment);
        postComments[postId].push(nextCommentId); // Link comment to post
        emit CommentCreated(newComment);
        nextCommentId++;
        return newComment.id;
    }

    // Get all comments for a specific post
    function getCommentsForPost(uint256 postId) public view returns (DataTypes.Comment[] memory) {
        uint256[] memory commentIds = postComments[postId];
        uint256 validCommentsCount = 0;

        for (uint256 i = 0; i < commentIds.length; i++) {
            if (commentIds[i] < nextCommentId) {
                validCommentsCount++;
            }
        }

        DataTypes.Comment[] memory postCommentsArray = new DataTypes.Comment[](validCommentsCount);
        uint256 index = 0;

        for (uint256 i = 0; i < commentIds.length; i++) {
            if (commentIds[i] < nextCommentId) {
                postCommentsArray[index] = comments[commentIds[i]];
                index++;
            }
        }

        return postCommentsArray;
    }
    
    // Retrieve comment details
    function getComment(uint256 commentId) public view 
        returns (DataTypes.Comment memory) 
    {
        require(commentId < nextCommentId, "Comment does not exist");
        return comments[commentId];
    }

    function getNextContentId() public view returns (uint256) {
        return nextContentId;
    }
}
