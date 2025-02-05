// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "../Libraries/DataTypes.sol";

interface IUserProfile{
    function incUserBalance (address user, uint256 amount) external returns (bool);
    function decUserBalance (address user, uint256 amount) external returns (bool);
    function getProfile(address user) external view returns (DataTypes.Profile memory);
    function setDonationContract() external;
}

contract Donation{

    IUserProfile UserProfileContract;

    event DonationReceived(address sender, uint256 amount);
    event EtherRetreived(address sender, uint256 amount );

    constructor (address _UserProfileContract){
        UserProfileContract = IUserProfile(_UserProfileContract);
    }

    function donate(address userAddress) payable public  {
        require(msg.value > 0, "msg.value can't be 0");
        UserProfileContract.incUserBalance(userAddress, msg.value);

        emit DonationReceived(msg.sender, msg.value);
    }

    function retreive() public {
        require(address(this).balance > 0, "No ETH available");
        DataTypes.Profile memory user = UserProfileContract.getProfile(msg.sender);

        require(user.balance > 0, "User has no ether");
        payable(msg.sender).transfer(user.balance);

        UserProfileContract.decUserBalance(msg.sender, user.balance);

        emit EtherRetreived(msg.sender, user.balance);


    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function setContractInUserProfile() external {
        UserProfileContract.setDonationContract();
    }

    function getAddress() external view returns (address){
        return address(this);
    }


}