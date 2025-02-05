const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//ModuleId needs to be exactly the contracts name
module.exports = buildModule("DeployContracts", (m) => {
    const UserProfile = m.contract("UserProfile");
    const userProfileAddress = m.staticCall(UserProfile, "getAddress", []);
    const Donation = m.contract("Donation", [userProfileAddress]);
    m.call(Donation, "setContractInUserProfile", []);

    const Comment = m.contract("Comment");

    const Post = m.contract("Post");


    return { UserProfile, Donation , Comment, Post};

});