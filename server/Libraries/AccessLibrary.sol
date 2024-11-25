// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;


library AccessControl {


    function checkOwner(address owner, address sender) internal pure {
        require(sender == owner, "Not the owner");
    }



}