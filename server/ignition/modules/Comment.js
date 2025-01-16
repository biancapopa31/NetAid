const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Comment", (m) => {
    const comment = m.contract("Comment");

    return { comment };
});