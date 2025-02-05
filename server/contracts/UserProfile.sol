// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../Libraries/ConstantsLibrary.sol";
import "../Libraries/DataTypes.sol";

contract UserProfile {

    address donationContractAddress;

    mapping(address => DataTypes.Profile) private profiles;
    address[] private userAddresses;
    mapping (string => address) private usernames;


    /*  EVENTS  */
    // creating a new profile
    event ProfileCreated(DataTypes.Profile _profile);

    event ProfileUpdated(DataTypes.Profile _profile);


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

    modifier  onlyDonationContract(address contractAddress){
        require(contractAddress == donationContractAddress, "You are not the donation contract");
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

    function setDonationContract() external {
        donationContractAddress = msg.sender;
    }


    function getProfile(address user) external view returns (DataTypes.Profile memory){
        return profiles[user];
    }


    function getAllUsersAddrs() external view returns ( address[] memory){
        return userAddresses;
    }

    function createNewProfile(string memory username, string memory bio, string memory profilePictureCdi
    ) public profileDoesNotExist validProfile(username) returns (bool) {

        profiles[msg.sender] = DataTypes.Profile(username, bio, profilePictureCdi, 0);
        userAddresses.push(msg.sender);
        usernames[username] = msg.sender;

        emit ProfileCreated(profiles[msg.sender]);
        return true;
    }

    function editProfile (string memory username, string memory bio, string memory profilePictureCdi
    ) public  validProfile(username) returns (bool) {

        usernames[profiles[msg.sender].username] = Constants.NULL_ADDRESS;
        uint256 _balance = profiles[msg.sender].balance;
        profiles[msg.sender] = DataTypes.Profile(username, bio, profilePictureCdi, _balance);
        usernames[username] = msg.sender;

        emit ProfileUpdated(profiles[msg.sender]);
        return true;
    }

    function incUserBalance (address user, uint256 amount) external 
    onlyDonationContract(msg.sender) 
    profileDoesNotExist returns (bool){
        profiles[user].balance += amount;
        return true;
    }

    function decUserBalance (address user, uint256 amount) external 
    onlyDonationContract(msg.sender) 
    profileDoesNotExist returns (bool){
        profiles[user].balance -= amount;
        return true;
    }

    function getAddress() external view returns (address){
        return address(this);
    }

}