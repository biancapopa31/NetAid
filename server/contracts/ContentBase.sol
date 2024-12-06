// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract ContentBase {

    struct Content {
        uint256 id;
        string contentURI;
        uint256 timestamp;
        address creator;
    }

    Content[] private  content_list;
    uint256 internal nextContentId = 0;

    modifier notEmptyURI(string memory uri) {
        require(bytes(uri).length > 0, "Content URI cannot be empty");
        _;
    }

    function _createContent(string memory contentURI) internal returns (uint256) {
        uint256 contentId = nextContentId;
        nextContentId++;

        content_list.push( Content({
            id: contentId,
            contentURI: contentURI,
            timestamp: block.timestamp,
            creator: msg.sender
        }));

        return contentId;
    }

    function getContent(uint256 contentId) public view returns (Content memory) {
        require(bytes(content_list[contentId].contentURI).length > 0, "Content does not exist");
        return content_list[contentId];
    }

    function getAllContent() public view returns (Content[] memory)  {
        return content_list;

    }

}
