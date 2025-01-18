const UserProfileModule = require("../ignition/modules/UserProfile");
const PostModule = require("../ignition/modules/Post");
const CommentModule = require("../ignition/modules/Comment");
const hre =  require("hardhat");
const saveDeployment = require("../ignition/utils/saveDeployment");
const copyABI = require("../ignition/utils/copyABI");

// !!! INAINTE DE DEPLOY SA STERGEM FOLDERELE ARTIFACTS CACHE SI CHAIN-31337 !!!

// TODO: add dummy data
async function main() {
    // Compile contracts before deploying
    await hre.run("compile");

    // Start deploying
    await deploy(UserProfileModule);
    await deploy(PostModule);
    await deploy(CommentModule);
}

async function deploy(contractModule) {
    const contractName = contractModule.id;
    console.log(`Deploying ${contractName}...`);

    // Deploy the module
    const deployments = await hre.ignition.deploy(contractModule);

    const deploymentJSON = JSON.stringify(deployments, null, 2);
    const parsedDeployment = JSON.parse(deploymentJSON);

    const contractAddress = getContractAddress(parsedDeployment);
    // console.log(deployments.userProfile?.target);
    console.log(`${contractName} deployed to: ${contractAddress}`);
    if(!contractAddress){
        console.error("Could not find deployment address");
        return;
    }

    // Save the deployment details
    saveDeployment(contractName, contractAddress);
    copyABI(contractName);
}

function getContractAddress(obj) {
    // If obj is an array, iterate over it
    if (Array.isArray(obj)) {
        for (let item of obj) {
            const result = getContractAddress(item);
            if (result) return result;
        }
    }

    // If obj is an object, check its properties
    if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            if (key === 'target') {
                return obj[key]; // Found 'target', return its value
            }
            const result = getContractAddress(obj[key]); // Recursively search inside nested objects
            if (result) return result;
        }
    }

    return null; // Return null if 'target' is not found
}

main().catch(console.error);