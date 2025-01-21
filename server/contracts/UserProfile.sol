// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../Libraries/ConstantsLibrary.sol";

contract UserProfile {


    struct Profile {
        string username;
        string bio;
        string profilePictureCdi;
    }

    mapping(address => Profile) private profiles;
    address[] private userAddresses;
    mapping (string => address) private usernames;


    /*  EVENTS  */
    // creating a new profile
    event ProfileCreated(address user, string username, string bio, string profilePictureCdi);

    event ProfileUpdated(address user, string username, string bio, string profilePictureCdi);


    /*  MODIFIERS   */
    // checks if the profile already exists
    modifier profileDoesNotExist() {
        require(
            bytes(profiles[msg.sender].username).length == 0,
            "Profile already exists for this address"
        );
        _;
    }

    modifier validProfile(string memory _username){
        require(bytes(_username).length > 0, "Username is required");
        require(usernames[_username] == Constants.NULL_ADDRESS || usernames[_username] == msg.sender, "Username is taken");
        _;
    }

    /*  FUNCTIONS   */

     function test() public pure returns(string memory){
        return "This is a test from UserProfile contract";
    }


        function existsUser() external view returns (bool){
        return bytes( profiles[msg.sender].username).length != 0;
    }


    function existsUserByUserId(string memory _username) external view returns (bool){
        return usernames[_username] != Constants.NULL_ADDRESS;
    }


    function getProfile(address user) public view returns (Profile memory){
        return profiles[user];
    }


    function getAllUsersAddrs() public view returns ( address[] memory){
        return userAddresses;
    }

    function createNewProfile(string memory username, string memory bio, string memory profilePictureCdi
    ) public profileDoesNotExist validProfile(username) returns (bool) {

        profiles[msg.sender] = Profile(username, bio, profilePictureCdi);
        userAddresses.push(msg.sender);
        usernames[username] = msg.sender;

        emit ProfileCreated(msg.sender, username, bio, profilePictureCdi);
        return true;
    }

    function editProfile (string memory username, string memory bio, string memory profilePictureCdi
    ) public validProfile(username) returns (bool) {

        usernames[profiles[msg.sender].username] = Constants.NULL_ADDRESS;
        profiles[msg.sender] = Profile(username, bio, profilePictureCdi);
        usernames[username] = msg.sender;

        emit ProfileUpdated(msg.sender, username, bio, profilePictureCdi);
        return true;
    }

}