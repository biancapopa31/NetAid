require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
    defaultNetwork: "localhost",
  networks: {
      localhost: {
          url: "http://127.0.0.1:8545", // Localhost RPC endpoint
          chainId: 31337,              // Hardhat's default chain ID
      },
      hardhat: {
        chainId: 31337,
      },
    },
};
