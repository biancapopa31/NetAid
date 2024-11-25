// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract UserProfile {

    address constant nullAddress = 0x0000000000000000000000000000000000000000;

    struct Profile {
        string username;
        string bio;
        string profilePictureURI;
    }

    mapping(address => Profile) private profiles;
    address[] private userAddresses;
    mapping (string => address) private usernames;


    /*  EVENTS  */
    // creating a new profile
    event ProfileCreated(address user, string username, string bio, string profilePictureURI);

    event ProfileUpdated(address user, string username, string bio, string profilePictureURI);


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
        require(usernames[_username] == nullAddress, "Username is taken");
        _;
    }

    /*  FUNCTIONS   */

    function getProfile(address user) public view returns (Profile memory){
        return profiles[user];
    }


    function getAllUsersAddrs() public view returns ( address[] memory){
        return userAddresses;
    }

    function createNewProfile(string memory username, string memory bio, string memory profilePictureURI
    ) public profileDoesNotExist validProfile(username) {

        profiles[msg.sender] = Profile(username, bio, profilePictureURI);
        userAddresses.push(msg.sender);
        usernames[username] = msg.sender;

        emit ProfileCreated(msg.sender, username, bio, profilePictureURI);
    }

    function editProfile (string memory username, string memory bio, string memory profilePictureURI
    ) public validProfile(username) {

        usernames[profiles[msg.sender].username] = nullAddress;
        profiles[msg.sender] = Profile(username, bio, profilePictureURI);
        usernames[username] = msg.sender;

        emit ProfileUpdated(msg.sender, username, bio, profilePictureURI);
    }

}