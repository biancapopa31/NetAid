#!/bin/bash

rm -r ../artifacts
rm -r ../cache
rm -r ../ignition/deployments

npx hardhat run deploy.js --network localhost
