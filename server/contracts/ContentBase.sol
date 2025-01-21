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

    Content[] private  content_list;
    uint256 internal nextContentId = 0;

    modifier notEmpty(string memory text, string memory photoCid) {
        require(bytes(text).length > 0 || bytes(photoCid).length > 0, "Content cannot be empty");
        _;
    }

    function createContent(string memory text, string memory photoCid) internal returns (uint256) {
        uint256 contentId = nextContentId;
        nextContentId++;

        content_list.push( Content({
            id: contentId,
            text: text,
            photoCid: photoCid,
            timestamp: block.timestamp,
            creator: msg.sender
        }));

        return contentId;
    }

    function getContent(uint256 contentId) public view returns (Content memory) {
        require(bytes(content_list[contentId].text).length > 0, "Content does not exist");
        return content_list[contentId];
    }

    function getAllContent() public view returns (Content[] memory)  {
        return content_list;

    }

}
