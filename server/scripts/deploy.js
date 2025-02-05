const DeployContractsModule = require("../ignition/modules/DeployContracts");
const hre = require("hardhat");
const saveDeployment = require("../ignition/utils/saveDeployment");
const copyABI = require("../ignition/utils/copyABI");

// TODO: add dummy data
async function main() {
    // Compile contracts before deploying
    await hre.run("compile");

    await deploy(DeployContractsModule);
}

async function deploy(contractModule) {
    console.log(`Deploying Contracts...`);

    // Deploy the module
    const deployments = await hre.ignition.deploy(contractModule);

    const addresses = Object.fromEntries(await Promise.all(Object.entries(deployments)
        .map(async ([name, contract]) => [name, 
            await contract.getAddress()
        ])));

    saveDeployment(addresses);

    Object.keys(addresses).forEach(contractName => {copyABI(contractName)});
}

main().catch(console.error);