// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ContentBase {

     struct Content {
        uint256 id;
        string text;
        string photoCid;
        uint256 timestamp;
        address creator;
    }
    
    mapping (uint => mapping (address => bool)) private _isLiker; // _isLiker[contentId][userAddress] = true if userAddress liked contentId;
    mapping (uint => uint) private likeCount; // mapping from contentId to nr of likes

    Content[] private  content_list;
    uint256 internal nextContentId = 0;

    modifier notEmpty(string memory text, string memory photoCid) {
        require(bytes(text).length > 0 || bytes(photoCid).length > 0, "Content cannot be empty");
        _;
    }
    modifier exists(uint256 _id){
        require(_id < nextContentId, "Content does not exist" );
        _;
    }

    function createContent(string memory text, string memory photoCid) internal returns (Content memory) {
        uint256 contentId = nextContentId;
        nextContentId++;

        Content memory newContent = Content(
            uint256(contentId), 
            text=text, 
            photoCid, 
            block.timestamp, 
            msg.sender
        );

        content_list.push(newContent);

        return newContent;
    }

    function getContent(uint256 contentId) internal view returns (Content memory) {
        require(bytes(content_list[contentId].text).length > 0, "Content does not exist");
        return content_list[contentId];
    }

    function like(uint256 contentId) public  returns (uint){
        _isLiker[contentId][msg.sender] = true;
        likeCount[contentId]++;
        return likeCount[contentId];
    }

    function unlike(uint256 contentId) public  returns (uint){
        require(likeCount[contentId] > 0, "This post dosen't have any likes");
        _isLiker[contentId][msg.sender] = false;
        likeCount[contentId]--;
        return likeCount[contentId];
    }

    function getLikeCount(uint contentId) public  view  returns (uint){
        return likeCount[contentId];
    }

    function isLikedByUser(uint contentId, address userAddress) public  view returns (bool) {
        return _isLiker[contentId][userAddress];
    }

    function getAllContent() internal view returns (Content[] memory)  {
        return content_list;
    }

}
