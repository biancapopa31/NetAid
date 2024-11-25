// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "server/contracts/UserProfile.sol";
import "server/Libraries/AccessLibrary.sol";
    

contract PostsContract is ERC721Enumerable {
    UserProfile public userProfileContract;
    struct Post {
        string contentURI; 
        uint256 timestamp;
    }

    uint256 private nextPostId; 
    mapping(uint256 => Post) private posts; 

    event PostCreated(address indexed creator, uint256 indexed postId, string contentURI);

    constructor(address contractAddress) ERC721("DecentralizedPost", "DPOST") {
        userProfileContract = UserProfile(contractAddress);
    }

    /*  MODIFIERS   */
    modifier existsUser(address user){
        require(userProfileContract.existsUser(user));
        _;
    }

    modifier notEmptyURI (string memory uri) {
        require(bytes(uri).length > 0, "Content URI cannot be empty");
        _;
    }

    modifier onlyOwner(address owner, address sender){
        AccessControl.checkOwner(owner, sender);
        _;
    }

    /*  FUNCTIONS   */

    function existsPost(uint256 _postId) external view returns (bool) {
       return (bytes(posts[_postId].contentURI).length > 0);
    }

    function createPost(string memory contentURI) public existsUser(msg.sender) notEmptyURI(contentURI) {

        uint256 postId = nextPostId;
        nextPostId++;

        // Mint the NFT to represent this post
        _mint(msg.sender, postId);

        // Store the post details
        posts[postId] = Post({
            contentURI: contentURI,
            timestamp: block.timestamp
        });

        emit PostCreated(msg.sender, postId, contentURI);
    }


    function getPost(uint256 postId) public view returns (string memory contentURI, uint256 timestamp) {
        require(bytes(posts[postId].contentURI).length > 0, "Post does not exist");

        Post memory post = posts[postId];
        return (post.contentURI, post.timestamp);
    }

    function getPostsByUser(address user) public view existsUser(user)
        returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory userPosts = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            userPosts[i] = tokenOfOwnerByIndex(user, i);
        }

        return userPosts;
    }

    function editPost(uint256 postId, string memory newContentURI ) public 
    existsUser(msg.sender) notEmptyURI(newContentURI) onlyOwner(ownerOf(postId), msg.sender){
        require(bytes(posts[postId].contentURI).length > 0, "Post does not exist");

       posts[postId].contentURI = newContentURI;
    }

    
}
