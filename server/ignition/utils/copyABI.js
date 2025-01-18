const fs = require("fs");
const path = require("path");

const copyABI = (contractName) => {
    const source = path.join(__dirname, `../../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    const destination = path.join(__dirname, `../../../client/src/abi/${contractName}.json`);

    if (fs.existsSync(source)) {
        const { abi } = JSON.parse(fs.readFileSync(source, "utf-8"));
        fs.writeFileSync(destination, JSON.stringify(abi , null, 2));
        console.log(`${contractName} ABI copied to frontend.`);
    } else {
        console.error(`ABI for ${contractName} not found.`);
    }
};

module.exports = copyABI;
