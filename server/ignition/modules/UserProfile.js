const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//ModuleId needs to be exactly the contracts name
module.exports = buildModule("UserProfile", (m) => {
    const userProfile = m.contract("UserProfile");

    return { userProfile };
});