// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library DataTypes {

    struct Profile {
        string username;
        string bio;
        string profilePictureCdi;
        uint256 balance; // stored in WEI
    }

    struct Comment{
        uint256 id;
        string text;
        uint256 timestamp;
        address creator;
    }
}
