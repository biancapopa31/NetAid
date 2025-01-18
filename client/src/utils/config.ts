import { PinataSDK } from "pinata-web3"

export const pinata = new PinataSDK({
    pinataJwt: process.env['REACT_APP_PINIATA_JWT'],
    pinataGateway: process.env['REACT_APP_PINIATA_GATEWAY_URL'],
})
