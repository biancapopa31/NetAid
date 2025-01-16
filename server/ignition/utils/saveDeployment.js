const fs = require("fs");
const path = require("path");

const saveDeployment = (network, contractName, address) => {
    const filePath = path.join(__dirname, "../../../deployment.json");
    let data = {};

    if (fs.existsSync(filePath)) {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    if (!data[network]) {
        data[network] = {};
    }

    data[network][contractName] = address;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`${contractName} address saved for network: ${network}.`);
};

module.exports = saveDeployment;