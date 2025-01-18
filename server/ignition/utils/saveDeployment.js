const fs = require("fs");
const path = require("path");

const saveDeployment = (contractName, address) => {
    const filePath = path.join(__dirname, "../../../client/src/utils/deployment.json");
    let data = {};

    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    data[contractName] = address;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`${contractName} address saved.`);
};

module.exports = saveDeployment;