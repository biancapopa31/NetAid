import {pinata} from "./config";

export const pinataService = {
    uploadFile: async (file: File) => {
        try {
            console.log("Uploading file to pinata.");
            const upload = await pinata.upload.file(file);
            console.log("Upload successful!");
            return upload.IpfsHash;
        }catch(err) {
            console.error("There was an error uploading the file:",err);
        }
    },

    convertCid: async function (cid: string) {
        try {
            console.log("Converting cid...");
            const url = await pinata.gateways.convert(cid);
            console.log("Conversion successful!");
            return url;
        }catch(err) {
            console.error("There was an error converting the file:",err);
        }
    }
}