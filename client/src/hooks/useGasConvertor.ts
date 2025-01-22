import {BrowserProvider, ethers} from "ethers";
import {useEffect, useState} from "react";


export function useGasConvertor(provider: BrowserProvider | null, gas: bigint | undefined) {
    const [result, setResult] = useState<{ eth?: number } | undefined>(undefined);
    useEffect(() => {
        if (!provider || !gas) return;
        provider.getFeeData().then((data) => {
            // console.log("start");
            // console.log(data.gasPrice* gas);
            // console.log(ethers.formatEther(data.gasPrice* gas));
            // console.log(ethers.formatEther(data.gasPrice* gas)*1e8);
            // console.log(Math.round(ethers.formatEther(BigInt(Number(data.gasPrice)* gas))*1e8));
            // console.log(Math.round(ethers.formatEther(BigInt(Number(data.gasPrice)* gas))*1e8)/1e8);
            // console.log("end");
            setResult({eth: Math.round(Number(ethers.formatEther(data.gasPrice* gas)) * 1e8) / 1e8})
        });
    }, [gas, provider]);

    return result;
}