const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//ModuleId needs to be exactly the contracts name
module.exports = buildModule("Comment", (m) => {
    const comment = m.contract("Comment");

    return { comment };
});