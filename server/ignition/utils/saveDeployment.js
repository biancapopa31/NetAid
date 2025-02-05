const fs = require("fs");
const path = require("path");

const saveDeployment = (data) => {
    const filePath = path.join(__dirname, "../../../client/src/utils/deployment.json");

    const updatedData = {
        ...data,
        deploymentTime: Math.floor(Date.now() / 1000)
    };

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    Object.entries(data).forEach(([contractName, contractAddress]) => {console.log(`${contractName} deployed at ${contractAddress}`);});
};

module.exports = saveDeployment;