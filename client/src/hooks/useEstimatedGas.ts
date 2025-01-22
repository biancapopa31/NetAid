import {BrowserProvider, Contract, ethers} from "ethers";
import {useCallback, useEffect, useMemo, useState} from "react";

type ContractFunction<F extends Function> = F & {
    estimateGas: (...p: Parameters<F>[]) => Promise<bigint>;
}

const hash = (obj) => JSON.stringify(obj, (_, v) => typeof v === 'bigint' ? v.toString() : v)

export function useEstimatedGasConditioned<F extends (...args: any[]) => any>(contract: Contract | null, fn: ContractFunction<F>, condition: boolean, ...args: Parameters<F>[]) {
    const [gas, setGas] = useState<{ gas: bigint } | undefined>(undefined);

    const contractFunction = useMemo(() => {
        return fn(contract);
    }, [contract]);

    useEffect(() => {
        console.log("useEstimatedGasConditioned", condition);
        if (!condition) return;
        contractFunction?.estimateGas(...args).then((gas) => {
                setGas({
                    gas: gas,
                })
        });
    }, [contractFunction, hash(args), condition]);

    return gas;
}

export function useEstimatedGas(contract, fn, ...args){
    return useEstimatedGasConditioned(contract, fn, true, ...args);
}