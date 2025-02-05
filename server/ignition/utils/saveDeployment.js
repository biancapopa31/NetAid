const fs = require("fs");
const path = require("path");

const saveDeployment = (data) => {
    const filePath = path.join(__dirname, "../../../client/src/utils/deployment.json");

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    Object.entries(data).forEach(([contractName, contractAddress]) => {console.log(`${contractName} deployed at ${contractAddress}`);});
};

module.exports = saveDeployment;