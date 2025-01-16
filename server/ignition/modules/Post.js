const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Post", (m) =>{
   const post = m.contract("Post");

   return {post};
});