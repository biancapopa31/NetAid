const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

//ModuleId needs to be exactly the contracts name
module.exports = buildModule("Post", (m) =>{
   const post = m.contract("Post");

   return {post};
});